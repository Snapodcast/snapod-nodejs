rm -rf dist

# Compile TypeScript files into JavaScript
npm run build

# If the directory, `dist`, doesn't exist, create `dist`
stat dist || mkdir dist

# Archive artifacts
zip dist/$npm_package_name.zip -r dist prisma .ebextensions package.json package-lock.json .env .npmrc

# Deploy artifacts to AWS Elastic Beanstalk
eb deploy
