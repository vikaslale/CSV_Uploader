-- CreateTable
CREATE TABLE "user_details" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "address" JSONB,
    "additional_info" JSONB,

    CONSTRAINT "user_details_pkey" PRIMARY KEY ("id")
);
