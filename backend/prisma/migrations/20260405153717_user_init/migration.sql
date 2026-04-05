-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenerationRecord" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "maleImgUrl" TEXT NOT NULL,
    "femaleImgUrl" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "scene" TEXT NOT NULL,
    "coupleImgUrl" TEXT NOT NULL,
    "blessing" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GenerationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "GenerationRecord" ADD CONSTRAINT "GenerationRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
