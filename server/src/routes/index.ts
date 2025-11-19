import { Router } from 'express';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes will be added here:
// router.use('/auth', authRoutes);
// router.use('/vaults', vaultsRoutes);
// router.use('/passwords', passwordsRoutes);
// router.use('/teams', teamsRoutes);
// router.use('/security', securityRoutes);
// router.use('/export-import', exportImportRoutes);
// router.use('/admin', adminRoutes);

export default router;
