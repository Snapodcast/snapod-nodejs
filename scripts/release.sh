# Compile TypeScript files into JavaScript
npm run build

# If the directory, `dist`, doesn't exist, create `dist`
stat releases || mkdir releases

# Archive artifacts
zip releases/$npm_package_name.zip -r releases prisma .ebextensions package.json package-lock.json .env .npmrc

# Deploy artifacts to AWS Elastic Beanstalk
eb deploy