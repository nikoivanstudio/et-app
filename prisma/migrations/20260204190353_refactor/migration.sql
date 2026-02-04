/*
  Warnings:

  - You are about to drop the column `createdAt` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `fileName` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `originalName` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `otp` table. All the data in the column will be lost.
  - You are about to drop the column `pubDate` on the `post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[filename]` on the table `file` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `author_id` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filename` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `original_name` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "file_fileName_key";

-- AlterTable
ALTER TABLE "activity" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "file" DROP COLUMN "createdAt",
DROP COLUMN "fileName",
DROP COLUMN "originalName",
ADD COLUMN     "author_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "original_name" TEXT NOT NULL,
ADD COLUMN     "type" VARCHAR(20) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "otp" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "post" DROP COLUMN "pubDate",
ADD COLUMN     "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "review" ADD COLUMN     "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "tour" ADD COLUMN     "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "file_filename_key" ON "file"("filename");

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
