import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimalFormData } from '../types';
import { animalService, AnimalFilters } from '../services/animalService';
import toast from 'react-hot-toast';

/**
 * Optimized React Query hooks for animals with caching and performance optimizations
 */

// Query keys for consistent caching
export const animalKeys = {
  all: ['animals'] as const,
  lists: () => [...animalKeys.all, 'list'] as const,
  list: (filters: AnimalFilters) => [...animalKeys.lists(), filters] as const,
  details: () => [...animalKeys.all, 'detail'] as const,
  detail: (id: string) => [...animalKeys.details(), id] as const,
  favorites: (userId?: string) => [...animalKeys.all, 'favorites', userId] as const,
  search: (query: string) => [...animalKeys.all, 'search', query] as const,
};

/**
 * Hook to fetch all animals with filters
 */
export const useAnimals = (filters?: AnimalFilters) => {
  return useQuery({
    queryKey: animalKeys.list(filters || {}),
    queryFn: () => animalService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes - animals don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes cache (renamed from cacheTime)
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new data
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
};

/**
 * Hook to fetch a single animal by ID
 */
export const useAnimal = (id: string) => {
  return useQuery({
    queryKey: animalKeys.detail(id),
    queryFn: () => animalService.getById(id),
    enabled: !!id, // Only run query if id exists
    staleTime: 10 * 60 * 1000, // 10 minutes - individual animals change less frequently
    gcTime: 60 * 60 * 1000, // 1 hour cache (renamed from cacheTime)
  });
};

/**
 * Hook to search animals
 */
export const useAnimalSearch = (query: string) => {
  return useQuery({
    queryKey: animalKeys.search(query),
    queryFn: () => animalService.search(query),
    enabled: query.length > 2, // Only search if query is longer than 2 characters
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 10 * 60 * 1000, // 10 minutes cache (renamed from cacheTime)
    placeholderData: (previousData) => previousData, // Keep previous search results
  });
};

/**
 * Hook to get user favorites
 */
export const useUserFavorites = (userId?: string) => {
  return useQuery({
    queryKey: animalKeys.favorites(userId),
    queryFn: () => animalService.getFavorites(),
    enabled: !!userId, // Only run if user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes cache (renamed from cacheTime)
  });
};

/**
 * Hook to create a new animal (admin only)
 */
export const useCreateAnimal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AnimalFormData) => animalService.create(data),
    onSuccess: (newAnimal) => {
      // Invalidate and refetch animals list
      queryClient.invalidateQueries({ queryKey: animalKeys.lists() });
      
      // Add the new animal to the cache
      queryClient.setQueryData(animalKeys.detail(newAnimal.id || newAnimal._id!), newAnimal);
      
      toast.success('Animal created successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create animal';
      toast.error(message);
    },
  });
};

/**
 * Hook to update an animal (admin only)
 */
export const useUpdateAnimal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AnimalFormData> }) =>
      animalService.update(id, data),
    onSuccess: (updatedAnimal, variables) => {
      // Update the specific animal in cache
      queryClient.setQueryData(animalKeys.detail(variables.id), updatedAnimal);
      
      // Invalidate lists to refetch with updated data
      queryClient.invalidateQueries({ queryKey: animalKeys.lists() });
      
      toast.success('Animal updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update animal';
      toast.error(message);
    },
  });
};

/**
 * Hook to delete an animal (admin only)
 */
export const useDeleteAnimal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => animalService.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: animalKeys.detail(deletedId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: animalKeys.lists() });
      
      toast.success('Animal deleted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete animal';
      toast.error(message);
    },
  });
};

/**
 * Hook to toggle animal favorite
 */
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (animalId: string) => {
      // We need to determine if it's currently favorited
      // This is a simplified version - you might want to check current state
      return animalService.addToFavorites(animalId);
    },
    onMutate: async (animalId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: animalKeys.detail(animalId) });
      await queryClient.cancelQueries({ queryKey: animalKeys.favorites() });

      // Snapshot the previous value
      const previousAnimal = queryClient.getQueryData(animalKeys.detail(animalId));
      const previousFavorites = queryClient.getQueryData(animalKeys.favorites());

      // Optimistically update the cache
      if (previousAnimal) {
        queryClient.setQueryData(animalKeys.detail(animalId), {
          ...previousAnimal,
          isFavorite: !(previousAnimal as any).isFavorite,
        });
      }

      return { previousAnimal, previousFavorites };
    },
    onError: (_err, animalId, context) => {
      // Revert optimistic update on error
      if (context?.previousAnimal) {
        queryClient.setQueryData(animalKeys.detail(animalId), context.previousAnimal);
      }
      if (context?.previousFavorites) {
        queryClient.setQueryData(animalKeys.favorites(), context.previousFavorites);
      }
      
      toast.error('Failed to update favorite');
    },
    onSettled: (_data, error, animalId) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: animalKeys.detail(animalId) });
      queryClient.invalidateQueries({ queryKey: animalKeys.favorites() });
      
      if (!error) {
        toast.success('Favorite updated!');
      }
    },
  });
};

/**
 * Prefetch animal data for better UX
 */
export const usePrefetchAnimal = () => {
  const queryClient = useQueryClient();

  const prefetchAnimal = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: animalKeys.detail(id),
      queryFn: () => animalService.getById(id),
      staleTime: 10 * 60 * 1000,
    });
  };

  const prefetchAnimals = (filters?: AnimalFilters) => {
    queryClient.prefetchQuery({
      queryKey: animalKeys.list(filters || {}),
      queryFn: () => animalService.getAll(filters),
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetchAnimal, prefetchAnimals };
};
