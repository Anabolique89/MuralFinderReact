#!/bin/bash

echo "🔧 Converting all relative imports to @ aliases..."

# Find all .jsx and .js files in src
find src -name "*.jsx" -o -name "*.js" | while read file; do
    echo "Processing: $file"
    
    # Replace relative imports with @ aliases
    sed -i \
        -e "s|from ['\"]\.\.*/services|from '@services|g" \
        -e "s|from ['\"]\.\.*/components|from '@components|g" \
        -e "s|from ['\"]\.\.*/store|from '@store|g" \
        -e "s|from ['\"]\.\.*/hooks|from '@hooks|g" \
        -e "s|from ['\"]\.\.*/utils|from '@utils|g" \
        -e "s|from ['\"]\.\.*/assets|from '@assets|g" \
        -e "s|from ['\"]\.\.*/style|from '@styles|g" \
        -e "s|from ['\"]\.\.*/pages|from '@pages|g" \
        -e "s|from ['\"]\.\.*/src|from '@|g" \
        -e "s|from ['\"]\.\/services|from '@services|g" \
        -e "s|from ['\"]\.\/components|from '@components|g" \
        -e "s|from ['\"]\.\/store|from '@store|g" \
        -e "s|from ['\"]\.\/hooks|from '@hooks|g" \
        -e "s|from ['\"]\.\/utils|from '@utils|g" \
        -e "s|from ['\"]\.\/assets|from '@assets|g" \
        -e "s|from ['\"]\.\/style|from '@styles|g" \
        -e "s|from ['\"]\.\/pages|from '@pages|g" \
        "$file"
done

echo "✅ Import conversion complete!"
echo ""
echo "🎯 Now you can use clean imports like:"
echo "  import { useAuth } from '@hooks/redux';"
echo "  import { ModernButton } from '@components';"
echo "  import AuthService from '@services/AuthService';"
echo "  import styles from '@styles';"
echo ""
echo "🚀 Restart your dev server to apply changes!"
