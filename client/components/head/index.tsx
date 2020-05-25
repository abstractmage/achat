import React from 'react';
import BaseHead from 'next/head';


function Head({ children }: { children: React.ReactNode }) {
  return (
    <BaseHead>
      <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      {children}
    </BaseHead>
  );
}


export default Head;
