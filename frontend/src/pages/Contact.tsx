import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Twitter, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import toast from 'react-hot-toast';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Implement contact form API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated delay
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin size={24} className="text-primary" />,
      title: 'Visit Us',
      content: 'Langata Road, Karen, Nairobi',
    },
    {
      icon: <Phone size={24} className="text-primary" />,
      title: 'Call Us',
      content: '+254 720 123 456',
      link: 'tel:+254720123456',
    },
    {
      icon: <Mail size={24} className="text-primary" />,
      title: 'Email Us',
      content: 'contact@example.com',
      link: 'mailto:contact@example.com',
    },
    {
      icon: <Clock size={24} className="text-primary" />,
      title: 'Opening Hours',
      content: 'Mon-Sun: 8:00 AM - 6:00 PM',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-gray-100 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {contactInfo.map((info, index) => (
            <Card key={index} padding="lg" hover className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary-light dark:bg-gray-700 rounded-full">
                  {info.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {info.title}
              </h3>
              {info.link ? (
                <a
                  href={info.link}
                  className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  {info.content}
                </a>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">{info.content}</p>
              )}
            </Card>
          ))}
        </div>

        {/* Response Time & Social Media */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {/* Response Time Card */}
          <Card padding="lg" className="bg-gradient-to-r from-blue-50 to-primary-light dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-full">
                <MessageCircle size={32} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Average Response Time
                </h3>
                <p className="text-3xl font-bold text-primary">2 Hours</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  We typically respond within 2 hours during business hours
                </p>
              </div>
            </div>
          </Card>

          {/* Social Media Card */}
          <Card padding="lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Connect With Us
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
              >
                <Facebook size={28} className="text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-gray-700 dark:text-gray-300">Facebook</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-4 bg-sky-50 dark:bg-sky-900/20 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-colors group"
              >
                <Twitter size={28} className="text-sky-500 dark:text-sky-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-gray-700 dark:text-gray-300">Twitter</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors group"
              >
                <Instagram size={28} className="text-pink-600 dark:text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-gray-700 dark:text-gray-300">Instagram</span>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group"
              >
                <Youtube size={28} className="text-red-600 dark:text-red-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-gray-700 dark:text-gray-300">YouTube</span>
              </a>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
              Follow us for daily updates, behind-the-scenes content, and special announcements!
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card padding="lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
              />

              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
              />

              <Input
                label="Subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
              >
                <Send size={18} className="mr-2" />
                Send Message
              </Button>
            </form>
          </Card>

          {/* Map & Additional Info */}
          <div className="space-y-6">
            <Card padding="none" className="overflow-hidden h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.186254721392!2d36.71877!3d-1.352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f05e0e89b3e2b%3A0x3b6d6f5f6f6f6f6f!2sKaren%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1635441234567!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Zoo Location"
              />
            </Card>

            <Card padding="lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Plan Your Visit
              </h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>
                  <span className="font-semibold">Parking:</span> Free parking available for all visitors
                </p>
                <p>
                  <span className="font-semibold">Accessibility:</span> Wheelchair accessible throughout
                </p>
                <p>
                  <span className="font-semibold">Food & Drinks:</span> Multiple cafes and restaurants on-site
                </p>
                <p>
                  <span className="font-semibold">Gift Shop:</span> Open daily during zoo hours
                </p>
              </div>
            </Card>

            <Card padding="lg" className="bg-primary-light dark:bg-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Emergency Contact
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                For urgent matters outside business hours:
              </p>
              <p className="text-2xl font-bold text-primary">
                +254 733 999 000
              </p>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card padding="lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Do I need to book tickets in advance?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  While walk-ins are welcome, we recommend booking online to guarantee entry and skip the queue.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Are pets allowed?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  For the safety of our animals, pets are not allowed except for registered service animals.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Can I bring my own food?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes! Picnic areas are available. We also have several food options on-site.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Is the zoo open on holidays?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes, we're open 365 days a year. Special hours may apply on major holidays.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

