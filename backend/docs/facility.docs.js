/**
 * @swagger
 * components:
 *   schemas:
 *     Facility:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The facility's unique ID
 *         uniqueIdentifier:
 *           type: string
 *           description: Unique facility identifier code
 *         facilityName:
 *           type: string
 *           description: Name of the health facility
 *         levelOfCare:
 *           type: string
 *           description: Level of healthcare provided (e.g., HC II, General Hospital)
 *         ownership:
 *           type: string
 *           enum: [Government, PNFP, PNP]
 *           description: Type of facility ownership
 *         authority:
 *           type: string
 *           enum: [MOH, Local Government]
 *           description: Managing authority of the facility
 *         Region:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: Region ID
 *             name:
 *               type: string
 *               description: Region name
 *         LocalGovt:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: Local government ID
 *             name:
 *               type: string
 *               description: Local government name
 *         SubCounty:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: Subcounty ID
 *             name:
 *               type: string
 *               description: Subcounty name
 *
 * /facility:
 *   get:
 *     tags:
 *       - Facilities
 *     summary: Retrieve a list of health facilities
 *     description: Fetches a paginated list of health facilities with optional filtering parameters
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [HC II, HC III, HC IV, General Hospital, Regional Referral Hospital, National Referral Hospital]
 *         description: Filter by facility level
 *       - in: query
 *         name: ownership
 *         schema:
 *           type: string
 *           enum: [Government, PNFP, PNP]
 *         description: Filter by facility ownership
 *       - in: query
 *         name: authority
 *         schema:
 *           type: string
 *           enum: [MOH, Local Government]
 *         description: Filter by managing authority
 *       - in: query
 *         name: regionId
 *         schema:
 *           type: string
 *         description: Filter by Region ID
 *       - in: query
 *         name: localGovtId
 *         schema:
 *           type: string
 *         description: Filter by Local Government ID
 *       - in: query
 *         name: subcountyId
 *         schema:
 *           type: string
 *         description: Filter by Subcounty ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: Successfully retrieved list of facilities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   description: Total number of facilities in response
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages available
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *                 facilities:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Facility'
 *       400:
 *         description: Bad request - Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid query parameters
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
