import mongoose from 'mongoose';
    import bcrypt from 'bcryptjs';

    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, enum: ['superadmin', 'admin', 'client'], required: true },
      brandSettings: {
        logo: String,
        primaryColor: String,
        secondaryColor: String
      },
      clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    });

    userSchema.pre('save', async function(next) {
      if (!this.isModified('password')) return next();
      this.password = await bcrypt.hash(this.password, 10);
      next();
    });

    export default mongoose.model('User', userSchema);
