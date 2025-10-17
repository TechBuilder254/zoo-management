import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';

interface ConnectionStatusProps {
  className?: string;
}

interface ServiceStatus {
  name: string;
  status: 'connected' | 'disconnected' | 'checking' | 'error';
  message: string;
  endpoint: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className = '' }) => {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'Backend API',
      status: 'checking',
      message: 'Checking connection...',
      endpoint: '/api/health'
    },
    {
      name: 'Database',
      status: 'checking',
      message: 'Checking connection...',
      endpoint: '/api/health'
    },
    {
      name: 'Redis Cache',
      status: 'checking',
      message: 'Checking connection...',
      endpoint: '/api/health'
    }
  ]);

  const [overallStatus, setOverallStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  useEffect(() => {
    checkConnections();
    // Check every 30 seconds
    const interval = setInterval(checkConnections, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkConnections = async () => {
    try {
      // Check backend health
      const healthResponse = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const isBackendConnected = healthResponse.ok;
      
      // Check config endpoint
      const configResponse = await fetch('/api/config/env', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const isConfigConnected = configResponse.ok;

      // Check if we can get data from APIs
      const animalsResponse = await fetch('/api/animals?limit=1', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const isDataConnected = animalsResponse.ok;

      // Update service statuses
      setServices(prev => prev.map(service => {
        switch (service.name) {
          case 'Backend API':
            return {
              ...service,
              status: isBackendConnected ? 'connected' : 'error',
              message: isBackendConnected ? 'API responding' : 'API not responding'
            };
          case 'Database':
            return {
              ...service,
              status: isDataConnected ? 'connected' : 'error',
              message: isDataConnected ? 'Database connected' : 'Database connection failed'
            };
          case 'Redis Cache':
            return {
              ...service,
              status: isConfigConnected ? 'connected' : 'error',
              message: isConfigConnected ? 'Cache connected' : 'Cache connection failed'
            };
          default:
            return service;
        }
      }));

      // Determine overall status
      const allConnected = isBackendConnected && isDataConnected && isConfigConnected;
      setOverallStatus(allConnected ? 'connected' : 'disconnected');

    } catch (error) {
      console.error('Connection check failed:', error);
      
      setServices(prev => prev.map(service => ({
        ...service,
        status: 'error',
        message: 'Connection failed'
      })));
      
      setOverallStatus('disconnected');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'checking':
        return <Loader className="w-4 h-4 text-yellow-500 animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
      case 'disconnected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'checking':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case 'connected':
        return 'border-green-500 bg-green-50';
      case 'disconnected':
        return 'border-red-500 bg-red-50';
      case 'checking':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <div className={`p-3 rounded-lg border-2 shadow-lg max-w-xs ${getOverallStatusColor()}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">
            System Status
          </h3>
          <div className="flex items-center space-x-1">
            {getStatusIcon(overallStatus)}
            <span className="text-xs font-medium">
              {overallStatus === 'connected' ? 'All Systems OK' : 
               overallStatus === 'disconnected' ? 'Issues Detected' : 'Checking...'}
            </span>
          </div>
        </div>
        
        <div className="space-y-1">
          {services.map((service, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span className="font-medium">{service.name}</span>
              <div className="flex items-center space-x-1">
                {getStatusIcon(service.status)}
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(service.status)}`}>
                  {service.message}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={checkConnections}
          className="mt-2 w-full text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
        >
          Refresh Status
        </button>
      </div>
    </div>
  );
};

export default ConnectionStatus;
