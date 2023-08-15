import { CronJob } from "cron";
import { Lawyer, Question } from "../models";
import { UsersInterface } from "../models/users/users.interface";
import sendFirebaseNotification from "./firebase";

class CronHelper {
    cronJob: CronJob;

    constructor() {
        this.cronJob = new CronJob("0 */3 * * *", async () => {
            try {
                console.log("Running cron job to notify lawyers");
                await this.notifyLawyerAboutNewQuestions();
            } catch (e) {
                console.error(e);
            }
        });

        // Start job
        if (!this.cronJob.running) {
            console.log("start cron");
            this.cronJob.start();
        }
    }

    public async startCron() {
        this.cronJob.start();
    }

    private async notifyLawyerAboutNewQuestions(): Promise<void> {
        const lawyers = await Lawyer.find({ is_deleted: { $ne: true } }).populate([
            { path: "user", select: "devices" },
        ]);
        Promise.all(
            lawyers?.map(async (lawyer) => {
                const user = lawyer?.user as unknown as UsersInterface;
                const questions = await Question.find({
                    categories: { $in: lawyer?.practiceAreas },
                    createdAt: { $gt: new Date(Date.now() - 1000 * 60 * 60 * 3) },
                });
                if (questions?.length > 0) {
                    if (user?.devices?.length > 0) {
                        const tokens = user?.devices?.map((dev) => {
                            return dev?.token;
                        });
                        if (tokens?.length > 0) {
                            sendFirebaseNotification(
                                tokens,
                                "New Leads",
                                `(${questions?.length}) New clients are looking for help!`
                            );
                        }
                    }
                }
            })
        );
    }
}

export default CronHelper;
