// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   compiler: {
//     styledComponents: true,
//   },
//   images: {
//     unoptimized: true,
//   },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // 👈 this enables static export to /out folder

  compiler: {
    styledComponents: true,
  },

  images: {
    unoptimized: true, // required for static export
  },
};

export default nextConfig;
