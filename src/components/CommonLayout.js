import React from 'react';
import { Card, CardHeader, CardContent } from './ui/card';

const CommonLayout = ({ title, icon: Icon, children, width = "max-w-md" }) => {
  return (
    <div className="container mx-auto mt-10 px-4 pb-10">
      <Card className={`w-full ${width} mx-auto`}>
        <CardHeader className="text-2xl font-bold text-center flex flex-col items-center">
          {Icon && <Icon size={48} className="text-blue-600 mb-2" />}
          {title}
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommonLayout;