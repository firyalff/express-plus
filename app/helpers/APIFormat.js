'use strict';

const methods = {
	response(message, data, error) {
		return {
			message: message,
			result: data,
			error: (error!=null)?error:null
		};
	},
	responsePaging(message, data, error) {
		var result = {
			items: data.values,
			length : parseInt(data.length),
			start : parseInt(data.start),
			remaining: parseInt(data.totalData) - parseInt(data.start) + parseInt(data.length)
		}

		return {
			message: message,
			result: result,
			error: (error!=null)?error:null
		};
	},
	responseDataTable(draw, data, error){
		var totalFiltered = (data.totalFiltered>data.total)?data.total:data.totalFiltered;

		return {
			draw: (draw)?draw:0,
			recordsTotal: data.total,
			recordsFiltered: totalFiltered,
			data: data.filteredData
		};
	}
};

module.exports = methods;