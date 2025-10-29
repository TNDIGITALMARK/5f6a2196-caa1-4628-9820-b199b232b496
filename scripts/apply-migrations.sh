#!/bin/bash

# ==============================================
# Apply Supabase Migrations Script
# ==============================================

echo "🚀 Supabase Migration Utility"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}⚠️  Supabase CLI not found.${NC}"
    echo ""
    echo "Would you like to:"
    echo "  1) Install Supabase CLI and apply migrations"
    echo "  2) View SQL files to apply manually"
    echo "  3) Exit"
    read -p "Enter choice (1-3): " choice

    case $choice in
        1)
            echo ""
            echo -e "${GREEN}Installing Supabase CLI...${NC}"
            npm install -g supabase
            ;;
        2)
            echo ""
            echo -e "${YELLOW}Manual Migration Instructions:${NC}"
            echo "1. Go to: https://supabase.com/dashboard"
            echo "2. Select your project"
            echo "3. Navigate to SQL Editor"
            echo "4. Copy and run these files in order:"
            echo ""
            echo "   📄 supabase/migrations/001_create_articles_table.sql"
            echo "   📄 supabase/migrations/002_create_user_interactions_table.sql"
            echo "   📄 supabase/migrations/003_create_helper_functions.sql"
            echo ""
            echo "SQL files are located in: ./supabase/migrations/"
            echo ""
            exit 0
            ;;
        3)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            exit 1
            ;;
    esac
fi

echo ""
echo -e "${GREEN}✅ Supabase CLI found${NC}"
echo ""

# Check if linked to project
if [ ! -f ".supabase/config.toml" ]; then
    echo -e "${YELLOW}⚠️  Not linked to Supabase project${NC}"
    echo ""
    read -p "Enter your Supabase project ref (e.g., hfndfmtxhqvubnfiwzlz): " project_ref

    if [ -z "$project_ref" ]; then
        echo -e "${RED}❌ Project ref required${NC}"
        exit 1
    fi

    echo ""
    echo -e "${GREEN}Linking to project...${NC}"
    supabase link --project-ref "$project_ref"

    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to link project${NC}"
        echo ""
        echo "You can also apply migrations manually:"
        echo "1. Go to: https://supabase.com/dashboard"
        echo "2. Run SQL files from: ./supabase/migrations/"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}📋 Applying migrations...${NC}"
echo ""

# Apply migrations
supabase db push

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Migrations applied successfully!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Start your app: npm run dev"
    echo "  2. The database will be automatically seeded with mock articles"
    echo "  3. Check MIGRATION_GUIDE.md for more details"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Migration failed${NC}"
    echo ""
    echo "Try applying migrations manually:"
    echo "1. Go to: https://supabase.com/dashboard"
    echo "2. Navigate to SQL Editor"
    echo "3. Run SQL files from: ./supabase/migrations/"
    echo ""
    exit 1
fi
