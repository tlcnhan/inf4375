module.exports = {
  updateGlissade: {
	type: "object",
    required: true,
    additionalProperties: false,
    properties: {
      nom: {
        type: "string",
        required: false
      },
      ouvert: {
        type: "string",
        required: false
      },
      deblaye: {
        type: "string",
        required: false
      },
      condition: {
        type: "string",
        required: false
	  },
      nom_arr: {
        type: "string",
        required: false
      },
	  cle: {
        type: "string",
        required: false
      },
	  date_maj: {
        type: "string",
		format: "date-time",
        required: false
      },
    }
  },
  createUser: {
    type: "object",
    required: true,
    additionalProperties: false,
    properties: {
      prenom: {
        type: "string",
        required: true
      },
      nom: {
        type: "string",
        required: true
      },
      courriel: {
		type: "string",
		required: true	
	  },
      nom_arr_surv: {
        type: "array",
        required: false,
		items: {
          type: "string",
          required: false
        }
      }
    }
  }	
};