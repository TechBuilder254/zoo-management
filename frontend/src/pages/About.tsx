import React from 'react';
import { Heart, Users, Award, Target, Globe, Shield } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Section } from '../components/common/Container';

export const About: React.FC = () => {
  const values = [
    {
      icon: <Heart size={32} className="text-primary" />,
      title: 'Animal Welfare',
      description: 'We prioritize the health, safety, and happiness of all animals in our care with world-class facilities and expert veterinary support.',
    },
    {
      icon: <Globe size={32} className="text-primary" />,
      title: 'Conservation',
      description: 'Active participation in global conservation programs to protect endangered species and their natural habitats.',
    },
    {
      icon: <Users size={32} className="text-primary" />,
      title: 'Education',
      description: 'Inspiring the next generation through engaging educational programs about wildlife and environmental responsibility.',
    },
    {
      icon: <Shield size={32} className="text-primary" />,
      title: 'Research',
      description: 'Contributing to scientific research that advances our understanding of animal behavior, health, and conservation.',
    },
  ];

  const team = [
    {
      name: 'Dr. Wanjiku Kimani',
      role: 'Chief Veterinarian',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
      bio: '15+ years experience in exotic animal care',
    },
    {
      name: 'David Mwangi',
      role: 'Zoo Director',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      bio: 'Passionate about wildlife conservation and education',
    },
    {
      name: 'Amina Ochieng',
      role: 'Conservation Manager',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
      bio: 'Leading our endangered species breeding programs',
    },
    {
      name: 'Joseph Kamau',
      role: 'Education Coordinator',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      bio: 'Developing engaging programs for visitors of all ages',
    },
  ];

  const milestones = [
    { year: '1995', event: 'Wildlife Zoo Founded' },
    { year: '2005', event: 'Opened African Savanna Exhibit' },
    { year: '2010', event: 'Rescued 50+ Endangered Species' },
    { year: '2015', event: 'Won International Conservation Award' },
    { year: '2020', event: 'Launched Virtual Education Program' },
    { year: '2025', event: 'Reached 10 Million Visitors' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Wildlife Zoo</h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto">
              Dedicated to wildlife conservation, education, and creating unforgettable experiences with nature's most amazing creatures.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <Section>
        <Card padding="lg" className="mb-16">
          <div className="flex items-center justify-center mb-6">
            <Target size={48} className="text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 text-center max-w-4xl mx-auto mb-4">
            To inspire conservation of the natural world through education, research, and unforgettable wildlife experiences. 
            We are committed to providing exceptional care for our animals while advancing conservation efforts globally.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 text-center max-w-4xl mx-auto">
            Every visit to our zoo supports critical conservation programs, helps protect endangered species, 
            and educates the public about the importance of preserving our planet's biodiversity.
          </p>
        </Card>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} hover padding="lg" className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary-light dark:bg-gray-700 rounded-full">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* History Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Our Journey
          </h2>
          <Card padding="lg">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      {milestone.year}
                    </div>
                  </div>
                  <div className="flex-1 pt-3">
                    <div className="h-1 bg-primary-light dark:bg-gray-700 rounded-full mb-2"></div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {milestone.event}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Our dedicated team of experts works tirelessly to ensure the best care for our animals and create memorable experiences for our visitors.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} hover padding="none" className="overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {member.bio}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <Card padding="lg" className="bg-gradient-to-r from-primary-light to-blue-50 dark:from-gray-800 dark:to-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Our Impact by the Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">200+</div>
              <div className="text-gray-700 dark:text-gray-300">Animals Cared For</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-700 dark:text-gray-300">Species Protected</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">100K+</div>
              <div className="text-gray-700 dark:text-gray-300">Students Educated</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">15</div>
              <div className="text-gray-700 dark:text-gray-300">Conservation Partners</div>
            </div>
          </div>
        </Card>

        {/* Awards Section */}
        <div className="mt-16">
          <Card padding="lg" className="text-center">
            <div className="flex justify-center mb-6">
              <Award size={64} className="text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Award-Winning Excellence
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Recognized internationally for our contributions to wildlife conservation, animal welfare, 
              and educational programs. Our commitment to excellence has earned us numerous accolades 
              from conservation organizations and tourism boards worldwide.
            </p>
          </Card>
        </div>
      </Section>
    </div>
  );
};

