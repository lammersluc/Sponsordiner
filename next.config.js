/** @type {import('next').NextConfig} */
const nextConfig = {

    output: 'standalone',

    async redirects() {
        return [
            {
                source: '/ondernemers.',
                destination: '/ondernemers',
                permanent: true
            }
        ];
    }

}

module.exports = nextConfig;