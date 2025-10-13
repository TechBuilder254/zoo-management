import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Heart, Shield, Users } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const Home: React.FC = () => {
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
      <div className="relative bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Wildlife Zoo
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto">
              Discover the wonders of nature and support wildlife conservation.
              Book your visit today for an unforgettable experience!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/booking">
                <Button size="lg" variant="secondary">
                  Book Tickets Now
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link to="/animals">
                <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-gray-100">
                  Explore Animals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Visit Us?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Experience the perfect blend of education, conservation, and entertainment
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




