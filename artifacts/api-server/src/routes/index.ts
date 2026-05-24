import { Router, type IRouter } from "express";
import healthRouter from "./health";
import ridesRouter from "./rides";
import profilesRouter from "./profiles";
import reviewsRouter from "./reviews";
import messagesRouter from "./messages";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(ridesRouter);
router.use(profilesRouter);
router.use(reviewsRouter);
router.use(messagesRouter);
router.use(statsRouter);

export default router;
