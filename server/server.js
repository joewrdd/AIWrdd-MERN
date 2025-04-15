const express = require("express");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const cors = require("cors");
const path = require("path");
const env = require("dotenv");

//----- Environment Variables -----
if (process.env.NODE_ENV === "production") {
} else {
  env.config({ path: path.resolve(__dirname, "../.env") });
}

require("./utils/database")();

const { errorHandler } = require("./middlewares/errorMiddleware");
const userRouter = require("./routes/userRouter");
const openAIRouter = require("./routes/openAIRouter");
const paymentRouter = require("./routes/paymentRouter");
const UserModel = require("./models/UserModel");
const historyRouter = require("./routes/historyRouter");

const app = express();
const PORT = process.env.PORT || 3008;

//----- Cron Trial Period -----
cron.schedule("0 0 * * * *", async () => {
  try {
    const presentDate = new Date();
    await UserModel.updateMany(
      {
        trialActive: true,
        trialExpires: { $lt: presentDate },
      },
      {
        trialActive: false,
        subscription: "Free",
        monthlyRequestCount: 5,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//----- Cron Free Period -----
cron.schedule("0 0 1 * * *", async () => {
  try {
    const presentDate = new Date();
    await UserModel.updateMany(
      {
        subscription: "Free",
        nextBillingDate: { $lt: presentDate },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//----- Cron Basic Period -----
cron.schedule("0 0 1 * * *", async () => {
  try {
    const presentDate = new Date();
    await UserModel.updateMany(
      {
        subscription: "Basic",
        nextBillingDate: { $lt: presentDate },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//----- Cron Premium Period -----
cron.schedule("0 0 1 * * *", async () => {
  try {
    const presentDate = new Date();
    await UserModel.updateMany(
      {
        subscription: "Premium",
        nextBillingDate: { $lt: presentDate },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//----- Middlewares -----
app.use((req, res, next) => {
  if (req.originalUrl === "/api/stripe/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

//----- CORS Configuration -----
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [process.env.NETLIFY_URL, "https://wrddai.netlify.app"]
      : "http://localhost:4001",
  credentials: true,
};
app.use(cors(corsOptions));

//----- Configure Cookie Parser -----
app.use(cookieParser());

//----- Routes -----
app.use("/api/users", userRouter);
app.use("/api/openai", openAIRouter);
app.use("/api/stripe", paymentRouter);
app.use("/api/history", historyRouter);

//----- Serve Static Assets In Production -----
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "public");

  app.use(express.static(staticPath));

  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      const indexPath = path.join(__dirname, "public", "index.html");
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ message: "API Endpoint Not Found..." });
    }
  });
}

//----- Error Handler -----
app.use(errorHandler);

//----- Server Start -----
app.listen(PORT, console.log(`Server is running on port ${PORT}`));

// Notes:
// 1) WebHook Listener: stripe listen --forward-to localhost:3008/api/stripe/webhook
// 2) Cron: In Node.js cron is a module that allows us to schedule task to be executed at specific times or intervals
