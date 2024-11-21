import request from "supertest";
import app from "../utils/server";
import prisma from "../utils/client";

describe("Sanity check", () => {
  test("Ensure tests run", async () => {
    expect(true).toBe(true);
  });
});

describe("Contributors Routes", () => {
  let organization: { id: string };
  let contributor: { id: string };

  beforeAll(async () => {
    await prisma.organizationContributor.deleteMany();
    await prisma.contributor.deleteMany();
    await prisma.organization.deleteMany();

    organization = await prisma.organization.create({
      data: {
        name: "Test Organization",
        description: "A test organization for contributors",
      },
    });

    contributor = await prisma.contributor.create({
      data: {
        firstName: "Test",
        lastName: "Contributor",
      },
    });
  });

  afterAll(async () => {
    await prisma.organizationContributor.deleteMany();
    await prisma.contributor.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.$disconnect();
  });

  describe("GET /organizations/:id/contributors", () => {
    test("Get contributors for an organization", async () => {
      await prisma.organizationContributor.create({
        data: {
          organizationId: organization.id,
          contributorId: contributor.id,
        },
      });

      const response = await request(app).get(
        `/organizations/${organization.id}/contributors`
      );
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe(contributor.id);
    });

    test("Get contributors for a non-existent organization", async () => {
      const response = await request(app).get(
        "/organizations/non-existent-id/contributors"
      );
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Organization not found");
    });
  });

  describe("POST /organizations/:id/contributors", () => {
    test("Add a contributor to an organization", async () => {
      const response = await request(app)
        .post(`/organizations/${organization.id}/contributors`)
        .send({ contributorId: contributor.id });

      expect(response.status).toBe(201); // Check correct status
      expect(response.body.organizationId).toBe(organization.id);
      expect(response.body.contributorId).toBe(contributor.id);
    });

    test("Add a contributor that is already linked", async () => {
      await prisma.organizationContributor.create({
        data: {
          organizationId: organization.id,
          contributorId: contributor.id,
        },
      });

      const response = await request(app)
        .post(`/organizations/${organization.id}/contributors`)
        .send({ contributorId: contributor.id });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "Contributor is already linked to this organization"
      );
    });

    test("Add a contributor to a non-existent organization", async () => {
      const response = await request(app)
        .post(`/organizations/non-existent-id/contributors`)
        .send({ contributorId: contributor.id });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Organization not found");
    });

    test("Add a non-existent contributor to an organization", async () => {
      const response = await request(app)
        .post(`/organizations/${organization.id}/contributors`)
        .send({ contributorId: "non-existent-id" });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Contributor not found");
    });
  });
});
