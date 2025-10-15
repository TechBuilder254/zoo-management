import { useState, useEffect } from 'react';
import { Animal } from '../types';
import { animalService, AnimalFilters } from '../services/animalService';
import toast from 'react-hot-toast';

export const useAnimals = (filters?: AnimalFilters) => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await animalService.getAll(filters);
        setAnimals(response.animals);
        setTotal(response.total);
        setTotalPages(response.totalPages);
      } catch (err) {
        const message = 'Failed to load animals';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.search, filters?.type, filters?.conservationStatus, filters?.sortBy, filters?.page]);

  return { animals, loading, error, total, totalPages };
};

export const useAnimal = (id: string) => {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await animalService.getById(id);
        setAnimal(data);
      } catch (err) {
        const message = 'Failed to load animal details';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);

  return { animal, loading, error };
};






