import { LicenseStatus } from "../../models/license_review/license_review.interface"

let aggregation_utils = {
  addressAggregation: () => {
    return [
      {
        $lookup: {
          from: "cities",
          let: { "city": "$address.city" },
          pipeline: [
            { $match: { $expr: { $eq: ["$$city", "$_id"] }, is_deleted: { $ne: true } } },
          ],
          as: 'address.city'
        }
      },
      {
        $lookup: {
          from: "states",
          let: { "state": "$address.state" },
          pipeline: [
            { $match: { $expr: { $eq: ["$$state", "$_id"] }, is_deleted: { $ne: true } } },
          ],
          as: "address.state"
        }
      },
      {
        $lookup: {
          from: "countries",
          let: { "country": "$address.country" },
          pipeline: [
            { $match: { $expr: { $eq: ["$$country", "$_id"] }, is_deleted: { $ne: true } } },
            { $project: { countryCode: 0 } }
          ],
          as: "address.country"
        }
      },
      {
        $addFields: {
          'address.city': { $arrayElemAt: ['$address.city.name', 0] },
          'address.cityId': { $arrayElemAt: ['$address.city._id', 0] },
          'address.state': { $arrayElemAt: ['$address.state.name', 0] },
          'address.stateId': { $arrayElemAt: ['$address.state._id', 0] },
          'address.country': { $arrayElemAt: ['$address.country', 0] },
        }
      }
    ]
  },
  profileAggregation() {
    return [
      {
        $lookup: {
          from: "organizations",
          let: { "id": "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$$id", "$user"] }, is_deleted: { $ne: true } } },
            ...this.addressAggregation(),
            { $project: { name: 1, type: 1, address: 1 } }
          ],
          as: "organization"
        }
      },
      {
        $lookup: {
          from: "lawyers",
          let: { "id": "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$$id", "$user"] }, is_deleted: { $ne: true } } },
            ...this.addressAggregation(),
            {
              $lookup: {
                from: "license_reviews",
                let: { "id": "$_id" },
                pipeline: [
                  { $match: { $expr: { $eq: [ "$profile", "$$id"] }, status: LicenseStatus.REVIEW, is_deleted: { $ne: true } } },
                ],
                as: "verifyReview"
              }
            },
            {
              $addFields: {
                verifyReview: {
                  $cond: [
                    { $eq: [{ $size: '$verifyReview' }, 0]}, false, true
                  ]
                }
              }
            },
            { $project: { address: 1, license: 1, city: 1, state: 1, verifyReview: 1 } }
          ],
          as: "lawyer"
        }
      },
      {
        $lookup: {
          from: "clients",
          let: { "id": "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$$id", "$user"] }, is_deleted: { $ne: true } } },
            ...this.addressAggregation(),
            { $project: { address: 1 } }
          ],
          as: "client"
        }
      },
      {
        $lookup: {
          from: "roles",
          let: { "role": "$role" },
          pipeline: [
            { $match: { $expr: { $eq: ["$$role", "$_id"] }, is_deleted: { $ne: true } } },
            { $project: { _id: 0, name: 1 } }
          ],
          as: "role"
        }
      },
      {
        $addFields: {
          organization: { $arrayElemAt: ['$organization', 0] },
          lawyer: { $arrayElemAt: ['$lawyer', 0] },
          client: { $arrayElemAt: ['$client', 0] },
          role: { $arrayElemAt: ['$role.name', 0] }
        }
      },
      {
        $project: {
          profile: {
            $switch: {
              branches: [
                { case: { $eq: ['$role', 'organization'] }, then: "$organization" },
                { case: { $eq: ['$role', 'lawyer'] }, then: "$lawyer" },
                { case: { $eq: ['$role', 'client'] }, then: "$client" },
              ],
              default: "No role"
            }
          },
          username: 1,
          subTitle: {
            $cond: [
              { $ifNull: ['$customTitle', false] }, '$customTitle', {$switch: {
                branches: [
                  { case: { $eq: ['$role', 'organization'] }, then: "$organization.type" },
                  {
                    case: { $eq: ['$role', 'lawyer'] }, then: {
                      $cond: [
                        { $eq: ['$lawyer.license.verified', true] },
                        { $concat: ['Advocate', ' - ', '$lawyer.license.enrollment'] },
                        { $concat: ['Advocate', ' - ', 'Not Verified'] }
                      ]
                    }
                  },
                  { case: { $eq: ['$role', 'client'] }, then: "Member" },
                ],
                default: "No subtitle"
              }}
            ]
          },
          verifiedBadge: 1,
          role: 1,
          fullName: 1,
          status: 1,
          image: 1,
          active: 1,
          is_deleted: 1
        }
      }
    ]
  }
}

export default aggregation_utils