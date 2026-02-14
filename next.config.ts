import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    dangerouslyAllowLocalIP:true,
    remotePatterns:[
      {
        protocol:"http",
        hostname:"localhost",
        port:"5050",
        pathname:"/uploads/**"
      },
      {
        //another example
        hostname:"unsplash.com",
        protocol:"https",
      }
    ]
  }
};

export default nextConfig;
