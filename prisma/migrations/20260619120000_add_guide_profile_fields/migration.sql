-- AlterTable
ALTER TABLE "user" ADD COLUMN     "bio" VARCHAR(2000),
ADD COLUMN     "cover_photo_id" INTEGER,
ADD COLUMN     "experience_since" INTEGER,
ADD COLUMN     "headline" VARCHAR(160),
ADD COLUMN     "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "specializations" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "user_slug_key" ON "user"("slug");
