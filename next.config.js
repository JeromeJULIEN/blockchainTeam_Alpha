/** @type {import('next').NextConfig} */
const nextConfig = {
    // to allow any image source from internet
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "**",
          }
        ],
      },
    // async headers(){
    //     return[
    //         {
    //             source:'/(.*)',
    //             headers:[
                    
    //                 {
    //                     key:'frame-ancestors',
    //                     value:"frame-ancestors 'https://*.withpaper.com' 'https://withpaper.com'"
    //                 }
    //             ]
    //         }
    //     ]
    // }
    
}

module.exports = nextConfig
