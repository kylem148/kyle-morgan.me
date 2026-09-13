import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // The /connect vCard route reads the profile photo from disk at request time.
  outputFileTracingIncludes: {
    "/connect/kyle-morgan.vcf": ["./src/app/\\(connect\\)/connect/_assets/profile.jpg"],
  },
};

export default nextConfig;
