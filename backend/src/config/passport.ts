import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import { User, UserRole } from '../models';

// Helper function to process Google profile data
const processGoogleProfile = (profile: any) => {
  const nameParts = profile.displayName?.split(' ') || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  return {
    firstName,
    lastName,
    profileImage: profile.photos?.[0]?.value,
    locale: profile._json?.locale
  };
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          $or: [
            { email: profile.emails?.[0].value },
            { googleId: profile.id }
          ]
        });

        console.log("Google profile:", profile);
        
        if (!user) {
          // Create new user with Google profile information
          const password = await bcrypt.hash(profile.id, 10); // Use Google ID as password seed
          const profileData = processGoogleProfile(profile);
          
          user = await User.create({
            email: profile.emails![0].value,
            name: profile.displayName,
            password,
            role: UserRole.USER,
            profileImage: profileData.profileImage,
            googleId: profile.id,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            locale: profileData.locale,
            isGoogleUser: true
          });
          
          console.log("New Google user created:", user.email);
        } else {
          // Update existing user with Google information if they don't have it
          if (!user.googleId || !user.isGoogleUser) {
            const profileData = processGoogleProfile(profile);
            const updateData: any = {
              googleId: profile.id,
              isGoogleUser: true
            };
            
            // Only update profile image if user doesn't have one
            if (!user.profileImage && profileData.profileImage) {
              updateData.profileImage = profileData.profileImage;
            }
            
            // Update names if not set
            if (!user.firstName || !user.lastName) {
              updateData.firstName = profileData.firstName;
              updateData.lastName = profileData.lastName;
            }
            
            await User.findByIdAndUpdate(user._id, updateData);
            console.log("Existing user updated with Google info:", user.email);
          }
        }

        return done(null, user);
      } catch (error) {
        console.log("Google auth error:", error);
        return done(error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;