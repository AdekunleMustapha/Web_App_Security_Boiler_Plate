import {
  Strategy as GoogleStrategy,
  VerifyCallback,
  Profile,
} from "passport-google-oauth20";
import passport from "passport";
import { User, IUser } from "../../Models/user";
import "reflect-metadata";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../../Configs/env";
import { Container } from "typedi";
import { LoggerService } from "../../Configs/winston.logger";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/api/auth/google/callback", //your google console callback uri
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      const logger = Container.get(LoggerService);

      try {
        if (
          !profile.emails ||
          !(profile.emails.length > 0) ||
          !profile.emails[0].value
        ) {
          logger.error("No email found in Google profile");
          return done(new Error("No email found in Google profile"));
        }

        const userEmail = profile.emails[0].value;
        const existingUser = await User.findOne({ email: userEmail });
        if (existingUser) {
          // User already exists, return the user
          return done(null, existingUser);
        }
        // Create a new user
        const newUser: IUser = new User({
          email: userEmail,
          googleId: profile.id,
        });
        await newUser.save();
        logger.info(`New user created: ${newUser}`);

        return done(null, newUser);
      } catch (error) {
        logger.error(`Error during Google authentication: ${error}`);
        return done(error as Error);
      }
    },
  ),
);

passport.serializeUser((user: Express.User, done) => {
  const userId = user as IUser;
  done(null, userId.id);
});

passport.deserializeUser(async (id: string, done) => {
  const logger = Container.get(LoggerService);

  try {
    const user = await User.findById(id);
    if (user) {
      done(null, user);
    } else {
      done(new Error("User not found"), false);
    }
  } catch (error) {
    logger.error("Error occurred in deserializing user");
  }
});
