import prisma from "../utils/client";

async function deleteAllEntries() {
  try {
    // Delete all contributors first to avoid foreign key constraints
    const deletedContributors = await prisma.contributor.deleteMany();
    console.log(`Deleted ${deletedContributors.count} contributors`);

    // Delete all organizations
    const deletedOrganizations = await prisma.organization.deleteMany();
    console.log(`Deleted ${deletedOrganizations.count} organizations`);

    // Delete all users
    const deletedUsers = await prisma.user.deleteMany();
    console.log(`Deleted ${deletedUsers.count} users`);

    console.log("All entries deleted successfully");
  } catch (error) {
    console.error("Error deleting entries:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the deletion function
deleteAllEntries();