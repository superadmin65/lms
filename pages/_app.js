// import React, { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import "css/konzeptes.css";
// import Layout from "comps/Layout2";
// import OnlyBigScreen from "comps/OnlyBigScreen";
// import ErrorBoundary from "../comps/ErrorBoundary";

// // for android app
// /*
// function MyApp({ Component, pageProps }) {
//   if (Component.getLayout) {
//     return Component.getLayout(
//       <ErrorBoundary>
//         <Component {...pageProps} />
//       </ErrorBoundary>
//     );
//   }
//   return (
//     <ErrorBoundary>
//       <Layout>
//         <Component {...pageProps} />
//       </Layout>
//     </ErrorBoundary>
//   );
// }
// */
// // for web app

// const mobileOnly = ["/posts/vocabulary", "/posts/image-based"];

// function MyApp({ Component, pageProps }) {
//   const pathname = usePathname();

//   //konzeptes

//   return <Component {...pageProps} />;

//   if (Component.getLayout) {
//     return Component.getLayout(
//       <ErrorBoundary>
//         <Component {...pageProps} />
//       </ErrorBoundary>
//     );
//   } else {
//     if (mobileOnly.indexOf(pathname) !== -1) {
//       return (
//         <>
//           <GoogleAnalytics trackPageViews gaMeasurementId='G-VTS9309GCE' />
//           <ErrorBoundary>
//             <OnlyBigScreen>
//               <Layout>
//                 <Component {...pageProps} />
//               </Layout>
//             </OnlyBigScreen>
//           </ErrorBoundary>
//         </>
//       );
//     }
//     return (
//       <>
//         <GoogleAnalytics trackPageViews gaMeasurementId='G-VTS9309GCE' />
//         <ErrorBoundary>
//           {/*
//            <Component {...pageProps} />
//          */}

//           <Layout>
//             <Component {...pageProps} />
//           </Layout>
//         </ErrorBoundary>
//       </>
//     );
//   }
// }

// export default MyApp;



import React from 'react';
import 'css/konzeptes.css';
import Layout from 'comps/Layout2';
import OnlyBigScreen from 'comps/OnlyBigScreen';
import ErrorBoundary from '../comps/ErrorBoundary';
import { useRouter } from 'next/router';
import UserDropdown from 'comps/UserDropdown'; // 👈 Import Global Dropdown (Optional if used in Layout)

const mobileOnly = ['/posts/vocabulary', '/posts/image-based'];

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const pathname = router.pathname;

  // --- 1. Custom Layouts (defined in page component) ---
  if (Component.getLayout) {
    return Component.getLayout(
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    );
  }

  // --- 2. Default Logic ---
  else {
    if (mobileOnly.indexOf(pathname) !== -1) {
      return (
        <ErrorBoundary>
          <OnlyBigScreen>
            <Layout>
              {/* If you want the dropdown globally on these pages, check Layout.js */}
              <Component {...pageProps} />
            </Layout>
          </OnlyBigScreen>
        </ErrorBoundary>
      );
    }
    return (
      <ErrorBoundary>
        <Layout>
          {/* NOTE: If 'Layout' has a header, go to 'comps/Layout2.js'
             and replace the Home Icon with <UserDropdown /> there.
           */}
          <Component {...pageProps} />
        </Layout>
      </ErrorBoundary>
    );
  }
}

export default MyApp;
