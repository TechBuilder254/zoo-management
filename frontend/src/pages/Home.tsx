import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Heart, Shield, Users, Star, Quote, Mail } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { eventService } from '../services/eventService';
import { newsletterService } from '../services/newsletterService';
import { Event } from '../types';
import toast from 'react-hot-toast';

export const Home: React.FC = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const eventsData = await eventService.getUpcoming();
        // Get next 3 upcoming events
        setUpcomingEvents(eventsData.slice(0, 3));
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);
    try {
      await newsletterService.subscribe(newsletterEmail);
      toast.success('Successfully subscribed to newsletter!');
      setNewsletterEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const testimonials = [
    {
      name: 'Grace Wanjiru',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      rating: 5,
      comment: 'Amazing experience! The animals are well-cared for and the staff is incredibly knowledgeable. My kids loved every minute of it.',
      date: '2 weeks ago',
    },
    {
      name: 'Peter Otieno',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      rating: 5,
      comment: 'The best zoo I\'ve ever visited. The conservation efforts are truly inspiring, and it\'s educational for the whole family.',
      date: '1 month ago',
    },
    {
      name: 'Faith Njeri',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      rating: 5,
      comment: 'Wonderful day out! The online booking made it so easy, and the e-tickets worked perfectly. Highly recommend!',
      date: '3 weeks ago',
    },
  ];

  const features = [
    {
      icon: <Users size={32} className="text-primary" />,
      title: 'Explore Wildlife',
      description: 'Discover amazing animals from around the world with detailed information about each species.',
    },
    {
      icon: <Calendar size={32} className="text-primary" />,
      title: 'Easy Booking',
      description: 'Book your tickets online and skip the queue. Plan your perfect zoo visit in advance.',
    },
    {
      icon: <Shield size={32} className="text-primary" />,
      title: 'Conservation',
      description: 'Support wildlife conservation efforts and learn about endangered species protection.',
    },
    {
      icon: <Heart size={32} className="text-primary" />,
      title: 'Family Fun',
      description: 'Create unforgettable memories with interactive exhibits and educational programs.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&h=1080&fit=crop')`
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Welcome to Wildlife Zoo
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto leading-relaxed">
              Discover the wonders of nature and support wildlife conservation.
              Book your visit today for an unforgettable experience!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/booking">
                <Button size="lg" variant="secondary" className="shadow-xl">
                  Book Tickets Now
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link to="/animals">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-primary shadow-xl">
                  Explore Animals
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Animal Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore by Animal Type
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our diverse collection of wildlife from around the world
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              type: 'Mammal',
              image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop',
              count: '50+',
              color: 'from-orange-500 to-red-600'
            },
            {
              type: 'Bird',
              image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop',
              count: '40+',
              color: 'from-blue-500 to-cyan-600'
            },
            {
              type: 'Reptile',
              image: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=400&h=300&fit=crop',
              count: '30+',
              color: 'from-green-500 to-emerald-600'
            },
            {
              type: 'Amphibian',
              image: 'https://images.unsplash.com/photo-1602052793312-b99c2a9ee797?w=400&h=300&fit=crop',
              count: '20+',
              color: 'from-purple-500 to-pink-600'
            },
          ].map((category) => (
            <Link key={category.type} to={`/animals?type=${category.type}`}>
              <Card padding="none" hover className="overflow-hidden group cursor-pointer">
                <div className="relative h-48">
                  <img
                    src={category.image}
                    alt={category.type}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`}></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.type}s</h3>
                    <p className="text-lg font-semibold">{category.count} Species</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>


      {/* Conservation Spotlight */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-4">
                🌍 Conservation Spotlight
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Protecting Endangered Species
              </h2>
              <p className="text-xl text-gray-100 mb-6">
                We're proud to be part of global conservation efforts, working to protect and preserve endangered species for future generations.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-4xl font-bold mb-2">15+</div>
                  <p className="text-gray-100">Endangered Species</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">30+</div>
                  <p className="text-gray-100">Breeding Programs</p>
                </div>
              </div>
              <Link to="/animals?status=Endangered">
                <Button size="lg" variant="secondary">
                  Meet Our Conservation Heroes
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=300&h=300&fit=crop"
                alt="Conservation"
                className="rounded-lg shadow-xl w-full h-48 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=300&h=300&fit=crop"
                alt="Conservation"
                className="rounded-lg shadow-xl w-full h-48 object-cover mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=300&h=300&fit=crop"
                alt="Conservation"
                className="rounded-lg shadow-xl w-full h-48 object-cover -mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=300&h=300&fit=crop"
                alt="Conservation"
                className="rounded-lg shadow-xl w-full h-48 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Animal Habitats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Visit Our Unique Habitats
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore carefully crafted environments that mirror natural habitats from around the world
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'African Savanna',
              description: 'Home to lions, elephants, giraffes, and zebras',
              image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop',
              animals: '25+ Species'
            },
            {
              name: 'Tropical Rainforest',
              description: 'Discover exotic birds, primates, and reptiles',
              image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=600&h=400&fit=crop',
              animals: '30+ Species'
            },
            {
              name: 'Aquatic Kingdom',
              description: 'Meet fascinating marine and freshwater creatures',
              image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
              animals: '40+ Species'
            },
          ].map((habitat, index) => (
            <Card key={index} padding="none" hover className="overflow-hidden group cursor-pointer">
              <div className="relative h-56">
                <img
                  src={habitat.image}
                  alt={habitat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-2">
                    {habitat.animals}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{habitat.name}</h3>
                  <p className="text-sm text-gray-200">{habitat.description}</p>
                </div>
              </div>
              <div className="p-4 bg-primary-light dark:bg-gray-800">
                <Link to="/animals" className="text-primary dark:text-white font-semibold flex items-center justify-center">
                  Explore Habitat
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Why Visit Section - Animal Focused */}
      <div className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Visit Our Animals?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experience wildlife up close and support conservation efforts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover padding="lg" className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary-light dark:bg-gray-700 rounded-full">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Visitors Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Hear about amazing animal encounters from our happy visitors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} padding="lg" hover>
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <div className="flex items-center">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} size={14} className="text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <Quote size={24} className="text-primary opacity-20" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  {testimonial.comment}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.date}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">200+</div>
              <div className="text-lg text-gray-100">Animals</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-lg text-gray-100">Species</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">25+</div>
              <div className="text-lg text-gray-100">Years</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1M+</div>
              <div className="text-lg text-gray-100">Visitors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <div className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Upcoming Events
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Join us for exciting programs and activities
                </p>
              </div>
              <Link to="/events">
                <Button variant="outline">
                  View All Events
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event._id} padding="none" hover className="overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                    <Calendar size={64} className="text-white opacity-50" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-primary mb-2">
                      <Calendar size={16} />
                      <span>{new Date(event.eventDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {event.startTime} - {event.endTime}
                      </span>
                      <Link to={`/events`}>
                        <Button variant="ghost" size="sm">
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-full">
                <Mail size={48} />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Connected with Wildlife
            </h2>
            <p className="text-xl text-gray-100 mb-8">
              Subscribe to our newsletter for updates on new animals, special events, and exclusive offers!
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 bg-white dark:bg-gray-800"
                disabled={isSubscribing}
              />
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                isLoading={isSubscribing}
                disabled={isSubscribing}
              >
                Subscribe
              </Button>
            </form>
            <p className="text-sm text-gray-200 mt-4">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card padding="lg" className="bg-gradient-to-r from-primary-light to-blue-50 dark:from-gray-800 dark:to-gray-700 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Book your tickets now and get ready for an amazing day with wildlife!
          </p>
          <Link to="/booking">
            <Button size="lg" variant="primary">
              Get Your Tickets
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};




