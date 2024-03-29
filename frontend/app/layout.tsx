import type {Metadata} from 'next'
import './globals.css'
import React from 'react';
import {AntdRegistry} from '@ant-design/nextjs-registry';

export const metadata: Metadata = {
  title: 'Podcast AI',
  description: 'Generated by Utodian.',
}


const RootLayout = ({children}: React.PropsWithChildren) => (
  <html lang="en">
  <body style={{background: "white"}}>
  <AntdRegistry>{children}</AntdRegistry>
  </body>
  </html>
);

export default RootLayout;