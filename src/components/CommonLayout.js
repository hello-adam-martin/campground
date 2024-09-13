import React from 'react';
import { Card, CardContent } from './ui/card';

const CommonLayout = ({ title, icon: Icon, children, sidebar, width = "max-w-7xl" }) => {
  return (
    <div className={`container mx-auto mt-10 px-4 pb-10 ${width}`}>
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-2/3 lg:pr-6 lg:border-r border-gray-200">
          <div className="flex items-center mb-6">
            {Icon && <Icon size={48} className="text-blue-600 mr-4" />}
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              {children}
            </CardContent>
          </Card>
        </div>
        <div className="lg:w-1/3 mt-6 lg:mt-0 lg:pl-6">
          {sidebar}
        </div>
      </div>
    </div>
  );
};

export default CommonLayout;