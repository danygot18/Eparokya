export const baptismFormConfig = [
  {
    section: 'Baptism Information',
    fields: [
      {
        type: 'date',
        label: 'Baptism Date (Mondays not available)',
        path: 'baptismDate',
        required: true,
        inputProps: {
          min: new Date().toISOString().split('T')[0]
        },
        customValidation: true // Flag for custom validation
      },
      {
        type: 'time',
        label: 'Baptism Time',
        path: 'baptismTime',
        required: true
      }
    ]
  }
];

export const childInformation = [
  {
    section: 'Child Information',
    fields: [
      {
        type: 'text',
        label: "Child's Full Name",
        path: 'child.fullName',
        required: true
      },
      {
        type: 'date',
        label: 'Date of Birth',
        path: 'child.dateOfBirth',
        required: true
      },
      {
        type: 'text',
        label: 'Place of Birth',
        path: 'child.placeOfBirth',
        required: true
      },
      {
        type: 'select',
        label: 'Gender',
        path: 'child.gender',
        required: true,
        options: [
          { value: 'Male', label: 'Male' },
          { value: 'Female', label: 'Female' }
        ]
      }
    ]
  }
];

export const parentsInformation = [
  {
    section: 'Parents Information',
    fields: [
      {
        type: 'text',
        label: "Father's Full Name",
        path: 'parents.fatherFullName',
        required: true
      },
      {
        type: 'text',
        label: "Father's Birthplace",
        path: 'parents.placeOfFathersBirth',
        required: true
      },
      {
        type: 'text',
        label: "Mother's Full Name",
        path: 'parents.motherFullName',
        required: true
      },
      {
        type: 'text',
        label: "Mother's Birthplace",
        path: 'parents.placeOfMothersBirth',
        required: true
      },
      {
        type: 'text',
        label: 'Address',
        path: 'parents.address',
        required: true
      },
      {
        type: 'text',
        label: 'Contact Number',
        path: 'phone',
        required: true
      },
      {
        type: 'select',
        label: 'Marriage Status',
        path: 'parents.marriageStatus',
        required: true,
        options: [
          { value: 'Simbahan', label: 'Church Wedding' },
          { value: 'Civil', label: 'Civil Wedding' },
          { value: 'Nat', label: 'Not Married' }
        ]
      }
    ]
  }
];

export const godParentsInformation = [
  {
    section: 'Godparents',
    fields: [
      {
        type: 'text',
        label: 'Godfather Name',
        path: 'ninong.name',
        required: true
      },
      {
        type: 'text',
        label: 'Godfather Address',
        path: 'ninong.address',
        required: true
      },
      {
        type: 'text',
        label: 'Godfather Religion',
        path: 'ninong.religion',
        required: true
      },
      {
        type: 'text',
        label: 'Godmother Name',
        path: 'ninang.name',
        required: true
      },
      {
        type: 'text',
        label: 'Godmother Address',
        path: 'ninang.address',
        required: true
      },
      {
        type: 'text',
        label: 'Godmother Religion',
        path: 'ninang.religion',
        required: true
      }
    ]
  }
];

export const documentsInformation = [
  {
    section: 'Required Documents',
    fields: [
      {
        type: 'file',
        label: 'Birth Certificate',
        path: 'documents.birthCertificate',
        fieldName: 'birthCertificate',
        required: true
      },
      {
        type: 'file',
        label: 'Marriage Certificate',
        path: 'documents.marriageCertificate',
        fieldName: 'marriageCertificate',
        required: true
      }
    ]
  },
  {
    section: 'Optional Documents',
    fields: [
      {
        type: 'file',
        label: 'Baptism Permit',
        path: 'documents.baptismPermit',
        fieldName: 'baptismPermit',
        required: false
      },
      {
        type: 'file',
        label: 'Certificate Of No Record Baptism',
        path: 'documents.certificateOfNoRecordBaptism',
        fieldName: 'certificateOfNoRecordBaptism',
        required: false
      }
    ]
  }
];


export const allFormConfigs = [
  ...baptismFormConfig,
  ...childInformation,
  ...parentsInformation,
  ...godParentsInformation,
  // ...documentsInformation
];