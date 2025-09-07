import express from 'express';
import HealthService from '../models/healthservice.js';

const router = express.Router();

// Create a new health service configuration
router.post('/', async (req, res) => {
    try {
        const { level, no_of_beds, health_care_services } = req.body;
        
        // Validate required fields
        if (!level || !health_care_services || !Array.isArray(health_care_services)) {
            return res.status(400).json({ 
                error: 'Invalid input. Required fields: level (string), health_care_services (array)' 
            });
        }

        const service = await HealthService.create({ 
            level, 
            no_of_beds: no_of_beds || 0,
            health_care_services 
        });
        
        res.status(201).json(service);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Get all health service configurations
router.get('/', async (req, res) => {
    try {
        const services = await HealthService.findAll();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get health service configuration by level
router.get('/:level', async (req, res) => {
    try {
        const services = await HealthService.findAll({
            where: { level: req.params.level },
        });
        
        if (services.length === 0) {
            return res.status(404).json({ message: 'No services found for this level' });
        }
        
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a health service configuration
router.put('/:id', async (req, res) => {
    try {
        const service = await HealthService.findByPk(req.params.id);
        if (!service) return res.status(404).json({ message: 'Service configuration not found' });

        const { level, no_of_beds, health_care_services } = req.body;
        
        // Validate the update data
        if (level === undefined && no_of_beds === undefined && !health_care_services) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        const updateData = {};
        if (level !== undefined) updateData.level = level;
        if (no_of_beds !== undefined) updateData.no_of_beds = no_of_beds;
        if (health_care_services) updateData.health_care_services = health_care_services;

        await service.update(updateData);
        res.status(200).json(service);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Delete a health service configuration
router.delete('/:id', async (req, res) => {
    try {
        const service = await HealthService.findByPk(req.params.id);
        if (!service) return res.status(404).json({ message: 'Service configuration not found' });

        await service.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
