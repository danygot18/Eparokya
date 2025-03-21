const mongoose = require('mongoose');

const massWeddingSchema = mongoose.Schema({
    weddingDateTime: { type: mongoose.Schema.Types.ObjectId, ref: 'adminDate' },
    groomName: { type: String, required: true },
    groomAddress: {
        BldgNameTower: { type: String, required: false },
        LotBlockPhaseHouseNo: { type: String, required: false },
        SubdivisionVillageZone: { type: String, required: false },
        Street: { type: String, required: true },
        District: { type: String, required: true },
        barangay: {
            type: String,
            enum: [
                'Bagumbayan', 'Bambang', 'Calzada', 'Cembo', 'Central Bicutan',
                'Central Signal Village', 'Comembo', 'East Rembo', 'Fort Bonifacio', 'Hagonoy',
                'Ibayo-Tipas', 'Katuparan', 'Ligid-Tipas', 'Lower Bicutan', 'Maharlika Village',
                'Napindan', 'New Lower Bicutan', 'North Daang Hari', 'North Signal Village', 'Palingon',
                'Pembo', 'Pinagsama', 'Pitogo', 'Post Proper Northside', 'Post Proper Southside',
                'Rizal', 'San Miguel', 'Santa Ana', 'South Cembo', 'South Daang Hari', 'South Signal Village',
                'Tanyag', 'Tuktukan', 'Upper Bicutan', 'Ususan', 'Wawa', 'West Rembo', 'Western Bicutan',
                'Others'
            ],
            required: true
        },
        customBarangay: {
            type: String,
            required: function () {
                return this.address.baranggay === 'Others';
            }
        },
        city: { type: String, enum: ['Taguig City', 'Others'], required: true },
        customCity: {
            type: String,
            required: function () {
                return this.address.city === 'Others';
            }
        },

    },
    groomPhone: { type: String, required: true },
    groomBirthDate: { type: Date, required: true },
    groomOccupation: { type: String, required: true },
    groomReligion: { type: String, required: true },
    groomFather: { type: String, required: true },
    groomMother: { type: String, required: true },

    brideName: { type: String, required: true },
    brideAddress: {

        BldgNameTower: { type: String, required: false },
        LotBlockPhaseHouseNo: { type: String, required: false },
        SubdivisionVillageZone: { type: String, required: false },
        Street: { type: String, required: true },
        District: { type: String, required: true },
        barangay: {
            type: String,
            enum: [
                'Bagumbayan', 'Bambang', 'Calzada', 'Cembo', 'Central Bicutan',
                'Central Signal Village', 'Comembo', 'East Rembo', 'Fort Bonifacio', 'Hagonoy',
                'Ibayo-Tipas', 'Katuparan', 'Ligid-Tipas', 'Lower Bicutan', 'Maharlika Village',
                'Napindan', 'New Lower Bicutan', 'North Daang Hari', 'North Signal Village', 'Palingon',
                'Pembo', 'Pinagsama', 'Pitogo', 'Post Proper Northside', 'Post Proper Southside',
                'Rizal', 'San Miguel', 'Santa Ana', 'South Cembo', 'South Daang Hari', 'South Signal Village',
                'Tanyag', 'Tuktukan', 'Upper Bicutan', 'Ususan', 'Wawa', 'West Rembo', 'Western Bicutan',
                'Others'
            ],
            required: true
        },
        customBarangay: {
            type: String,
            required: function () {
                return this.address.baranggay === 'Others';
            }
        },
        city: { type: String, enum: ['Taguig City', 'Others'], required: true },
        customCity: {
            type: String,
            required: function () {
                return this.address.city === 'Others';
            }
        },
    },
    bridePhone: { type: String, required: true },
    brideBirthDate: { type: Date, required: true },
    brideOccupation: { type: String, required: true },
    brideReligion: { type: String, required: true },
    brideFather: { type: String, required: true },
    brideMother: { type: String, required: true },

    Ninong: [
        {
            name: { type: String, required: true },
            address: {
                street: { type: String, required: true },
                zip: { type: String, required: true },
                city: { type: String, required: true },
            },
        },
    ],
    Ninang: [
        {
            name: { type: String, required: true },
            address: {
                street: { type: String, required: true },
                zip: { type: String, required: true },
                city: { type: String, required: true },
            },
        },
    ],

    // Image Fields Groom
    GroomNewBaptismalCertificate: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    GroomNewConfirmationCertificate: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    GroomMarriageLicense: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    GroomMarriageBans: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    GroomOrigCeNoMar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    GroomOrigPSA: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },

    GroomPermitFromtheParishOftheBride: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    GroomChildBirthCertificate: {
        public_id: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,
        },
    },
    GroomOneByOne: {
        public_id: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,
        },
    },
    // Image Fields Bride
    BrideNewBaptismalCertificate: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    BrideNewConfirmationCertificate: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    BrideMarriageLicense: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    BrideMarriageBans: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    BrideOrigCeNoMar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    BrideOrigPSA: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    BridePermitFromtheParishOftheBride: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    BrideChildBirthCertificate: {
        public_id: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,
        },
    },
    BrideOneByOne: {
        public_id: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,
        },
    },

    weddingStatus: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Confirmed', 'Cancelled'],
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    confirmedAt: {
        type: Date,
    },

    cancellingReason: {
        user: { type: String, enum: ['Admin, User'] },
        reason: { type: String },
    },

    // for Admin to fill out
    additionalReq: {
        PreMarriageSeminar: {
            date: { type: Date },
            time: { type: String },
        },
        CanonicalInterview: {
            date: { type: Date },
            time: { type: String },
        },

        Confession: {
            date: { type: Date },
            time: { type: String },
        },
        createdAt: { type: Date, default: Date.now },

    },
    comments: [
        {
            selectedComment: String,
            additionalComment: String,
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    checklistId: { type: mongoose.Schema.Types.ObjectId, ref: 'WeddingChecklist' },
    termsAndConditionsId: { type: mongoose.Schema.Types.ObjectId, ref: 'TermsAndConditions' }

}, { timestamps: true });

massWeddingSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

massWeddingSchema.set('toJSON', {
    virtuals: true,
});

exports.massWedding = mongoose.model('massWedding', massWeddingSchema);
