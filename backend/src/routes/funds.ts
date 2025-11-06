// src/routes/funds.ts
import { Router, Request, Response } from "express";
import controller from "../controllers/funds";
import { ErrorMessage } from "../utils/types";
import auth from "../middleware/auth";
import admin from "firebase-admin";
import prisma from "../utils/client";

const fundRouter = Router();

declare module "express-serve-static-core" {
  interface Request {
    user?: admin.auth.DecodedIdToken;
  }
}

// Require auth for all routes below
fundRouter.use(auth);

// helper: get user's organizationId
async function getUserOrganizationId(firebaseUid: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { firebaseUid },
    select: { organizationId: true },
  });
  if (!user) throw new Error("User not found");
  return user.organizationId;
}

// GET /funds  -> all funds for caller's org
fundRouter.get("/", async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const organizationId = await getUserOrganizationId(req.user.uid);
    const funds = await controller.getFunds({ organizationId });

    res.status(200).json({ funds });
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: error instanceof Error ? error.message : "Failed to get funds",
    };
    res.status(500).json(errorResponse);
  }
});

// GET /funds/:id -> single fund (must belong to caller's org)
fundRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const organizationId = await getUserOrganizationId(req.user.uid);
    const fund = await controller.getFundById(req.params.id);

    if (!fund) return res.status(404).json({ error: "Fund not found" });
    if (fund.organizationId !== organizationId)
      return res.status(403).json({ error: "Unauthorized" });

    res.status(200).json(fund);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: error instanceof Error ? error.message : "Failed to get fund",
    };
    res.status(500).json(errorResponse);
  }
});

// POST /funds -> create fund in caller's org
fundRouter.post("/", async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const fundData = { ...req.body };

    if (!fundData.organizationId || !fundData.type) {
      return res
        .status(400)
        .json({ error: "organizationId and type are required" });
    }

    // normalize type
    if (typeof fundData.type === "string") {
      fundData.type = String(fundData.type).toUpperCase();
    }

    // restricted endowment must include purpose
    if (fundData.type === "ENDOWMENT" && fundData.restriction === true) {
      if (!fundData.purpose || !String(fundData.purpose).trim()) {
        return res.status(400).json({
          error: "Purpose is required for restricted endowment funds.",
        });
      }
    }

    const organizationId = await getUserOrganizationId(req.user.uid);
    if (organizationId !== fundData.organizationId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const newFund = await controller.createFund(fundData);
    return res.status(201).json(newFund);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: error instanceof Error ? error.message : "Failed to create fund",
    };
    return res.status(400).json(errorResponse);
  }
});

// PUT /funds/:id -> update fund (must belong to caller's org)
fundRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const id = req.params.id;
    const organizationId = await getUserOrganizationId(req.user.uid);

    const fund = await controller.getFundById(id);
    if (!fund) return res.status(404).json({ error: "Fund not found" });
    if (fund.organizationId !== organizationId)
      return res.status(403).json({ error: "Unauthorized" });

    const updatedFund = await controller.updateFund(id, req.body);
    res.status(200).json(updatedFund);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: error instanceof Error ? error.message : "Failed to update fund",
    };
    if (errorResponse.error === "Fund not found") {
      res.status(404).json(errorResponse);
    } else {
      res.status(400).json(errorResponse);
    }
  }
});

// DELETE /funds/:id -> delete fund (must belong to caller's org)
fundRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const organizationId = await getUserOrganizationId(req.user.uid);
    const fund = await controller.getFundById(req.params.id);
    if (!fund) return res.status(404).json({ error: "Fund not found" });
    if (fund.organizationId !== organizationId)
      return res.status(403).json({ error: "Access denied" });

    await controller.deleteFundById(req.params.id);
    res.status(200).json({ message: "Fund deleted" });
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: error instanceof Error ? error.message : "Failed to delete fund",
    };
    res.status(500).json(errorResponse);
  }
});

// GET /funds/:id/transactions -> list transactions for a fund
fundRouter.get("/:id/transactions", async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const organizationId = await getUserOrganizationId(req.user.uid);

    const fund = await controller.getFundById(id);
    if (!fund) {
      return res.status(404).json({ error: "Fund not found" });
    }
    if (fund.organizationId !== organizationId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const sortBy = req.query.sortBy as string | undefined;
    const order = (req.query.order as string | undefined) ?? "asc";
    const validSortField = new Set(["date", "amount"]);
    const validOrders = new Set(["asc", "desc"]);

    const sort =
      sortBy && validSortField.has(sortBy)
        ? {
            field: sortBy as "date" | "amount",
            order: validOrders.has(order) ? (order as "asc" | "desc") : "asc",
          }
        : undefined;

    const pagination = {
      skip: req.query.skip ? Number(req.query.skip) : undefined,
      take: req.query.take ? Number(req.query.take) : undefined,
    };

    const { transactions, total } = await controller.getTransactionsByFundId(
      id,
      sort,
      pagination
    );

    res.status(200).json({ transactions, total });
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error
          ? error.message
          : "Failed to get fund's transactions",
    };
    if (errorResponse.error === "Fund not found") {
      res.status(404).json(errorResponse);
    } else {
      res.status(500).json(errorResponse);
    }
  }
});

// GET /funds/:id/contributors -> list contributors for a fund
fundRouter.get("/:id/contributors", async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const organizationId = await getUserOrganizationId(req.user.uid);

    const fund = await controller.getFundById(id);
    if (!fund) {
      return res.status(404).json({ error: "Fund not found" });
    }
    if (fund.organizationId !== organizationId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const sortBy = req.query.sortBy as string | undefined;
    const order = (req.query.order as string | undefined) ?? "asc";
    const validSortField = new Set(["firstName", "lastName"]);
    const validOrders = new Set(["asc", "desc"]);

    const sort =
      sortBy && validSortField.has(sortBy)
        ? {
            field: sortBy as "firstName" | "lastName",
            order: validOrders.has(order) ? (order as "asc" | "desc") : "asc",
          }
        : undefined;

    const pagination = {
      skip: req.query.skip ? Number(req.query.skip) : undefined,
      take: req.query.take ? Number(req.query.take) : undefined,
    };

    const { contributors, total } = await controller.getContributorsByFundId(
      id,
      sort,
      pagination
    );
    res.status(200).json({ contributors, total });
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error
          ? error.message
          : "Failed to get fund contributors",
    };
    if (errorResponse.error === "Fund not found") {
      res.status(404).json(errorResponse);
    } else {
      res.status(500).json(errorResponse);
    }
  }
});

export default fundRouter;
