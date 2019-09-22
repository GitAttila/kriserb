var Site = (function() {
	var URL = './resources/data/site.json';

	function getSiteData(funcCB) {
		if (typeof funcCB !== 'function') {
			funcCB = function() {};
		}

		$.getJSON(URL)
			.done(function(data) {
				console.log('site data loaded succesfully...');
				let contactInfo = data.contactinfo || {};
				socmediaHTML = getSocialMediaSnippet(contactInfo );
				$('[data-site="socialmedia"]').html(socmediaHTML);
				contactHTML = getContactSnippet(data);
				$('[data-site="contactinfo"]').html(contactHTML);
				pressHTML = getPressSnippet(data);
				$('[data-site="press"]').html(pressHTML);
				bioHTML = getBioSnippet(data);
				$('[data-site="biography"]').html(bioHTML);
				publicationsHTML = getPublicationsSnippet(data);
				$('[data-site="publications"]').html(publicationsHTML);
				funcCB();
			})
			.fail(function(jqxhr, textStatus, error) {
				var err = textStatus + ', ' + error;
				console.log('Request Failed: ' + err);
				$('#content-spinner .spinner-msg')
					.addClass('spinner-msg-alert')
					.html('Could not load the site data file.</br> Check console for more detail.');
				funcCB();
			});
	}

	function getSocialMediaSnippet(data) {
		htmlCode = '';
		if (data.socialmedia) {
			$(data.socialmedia).each(function(key, val) {
				val.link = val.link.trim();
				if (typeof val.active !== 'boolean') {
					val.active = val.active.trim().toLowerCase();
				}
				val['open-new-window'] = val['open-new-window'].trim().toLowerCase();
				if (val['open-new-window'] === true || val['open-new-window'] === 'true') {
					target = ' target="_blank"';
				} else {
					target = '';
				}
				if (val.active === true || (val.active === 'true' && val.link !== '')) {
					htmlCode += '<a href="' + val.link + '"' + target + '>';
					htmlCode += '<i class="icon ' + val['ion-icon'] + '"></i>';
					htmlCode += '</a>';
				}
			});
		}
		return htmlCode;
	}

	function getContactSnippet(data) {
		htmlCode = '';
		if (data.contactinfo) {
			$('#content-contact-title').text(data.contactinfo.title || '');
			htmlCode += '<div class="contact-divider col-xs-12 col-sm-5 col-md-4">';
			htmlCode += '<div class="contact-qrcode">';
			htmlCode += '<img src="' + data.contactinfo.qrcode.path + '" alt="' + data.contactinfo.qrcode.alt + '" >';
			htmlCode += '</div></div><div class="contact-card contact-divider col-xs-12 col-sm-7 col-md-8">';
			htmlCode += '<h3>' + data.contactinfo.subtitle + '</h3>';
			htmlCode += '<address>';
			$(data.contactinfo.email).each(function(key, val) {
				val.emailaddress = val.emailaddress.trim();
				val.icon = val.icon.trim();
				if (val.emailaddress !== '' && val.icon !== '') {
					htmlCode += '<p><i class="icon ' + val.icon + '"></i>' + val.emailaddress + '</p>';
				}
			});
			$(data.contactinfo.phone).each(function(key, val) {
				val.icon = val.icon.trim();
				val.number = val.number.trim();
				if (val.icon !== '' && val.number !== '') {
					htmlCode += '<p><i class="icon ' + val.icon + '"></i>' + val.number + '</p>';
				}
			});
			htmlCode += '</address>';
		}
		return htmlCode;
	}

	function getPressSnippet(data) {
		htmlCode = '';
		htmlCodeCouple = '';
		if (data.press) {
			if (data.press.record) {
				let lenOfRecs = data.press.record.length;
				$(data.press.record).each(function(key, val) {
					key = key + 1;
					htmlCodeCouple += buildPressSnippet(val);
					if (key !== 0 && key % 2 === 0) {
						htmlCodeCouple = '<div class="row dotted-spaced-light row-press">' + htmlCodeCouple + '</div>';
						htmlCode += htmlCodeCouple;
						htmlCodeCouple = '';
					} else if (key === lenOfRecs) {
						htmlCodeCouple = '<div class="row dotted-spaced-light row-press">' + htmlCodeCouple + '</div>';
						htmlCode += htmlCodeCouple;
					}
				});
			}
		}

		return htmlCode;

		//helper function
		function buildPressSnippet(jsonRecord) {
			var html = '';
			var link = '';
			var img = '';
			if (jsonRecord.link) {
				jsonRecord.link.path = jsonRecord.link.path.trim();
				jsonRecord.link.icon = (jsonRecord.link.icon || 'ion-ios-open').trim().toLowerCase();
				jsonRecord.link.text = (jsonRecord.link.text || 'visit').trim().toUpperCase();
				if (jsonRecord.link.path) {
					link = '<a class="press-link" href="' + jsonRecord.link.path + '" target="_blank">';
					link += '<i class="icon ' + jsonRecord.link.icon + '"></i> ' + jsonRecord.link.text + ' </a>';
				}
			}
			// if logo path is empty, than choose a suplamentary icon instead of an image
			if (jsonRecord.medialogo) {
				img = '<i class="icon icon-press ion-ios-paper"></i>';
				if (jsonRecord.medialogo.path) {
					jsonRecord.medialogo.path = jsonRecord.medialogo.path.trim();
					if (jsonRecord.medialogo.path.length !== 0) {
						img =
							'<img class="press-logo" src="' +
							jsonRecord.medialogo.path +
							'" alt="' +
							jsonRecord.medialogo.alt +
							'">';
					}
				}
			}
			jsonRecord.text = jsonRecord.text.trim();
			jsonRecord.title = jsonRecord.title.trim();
			if (jsonRecord.title !== '' && jsonRecord.text !== '') {
				html += '<div class="col-xs-12 col-sm-6"><div class="row"><div class="col-xs-12 col-lg-4">';
				html += img;
				html += '</div><div class="col-xs-12 col-lg-8">';
				html += '<h3>' + jsonRecord.title + '</h3>';
				html += '<h4>' + jsonRecord.subtitle + '</h4>';
				html += '<p>' + jsonRecord.text + '</p>';
				html += '<p class="font-title">';
				html += link + '</p></div></div></div>';
			}
			return html;
		}
	}

	function getBioSnippet(data) {
		var htmlCode = '';
		if (data.biography) {
			if (data.biography.intro) {
				htmlCode += '<div class="bio-row row"><div class="col-xs-12 col-sm-12 col-md-3">';
				htmlCode +=
					'<img class="round-portrait" src="' +
					data.biography.intro.image.path +
					'" alt="' +
					data.biography.intro.image.alt +
					'">';
				htmlCode += '</div><div class="col-xs-12 col-sm-12 col-md-9 dotted-spaced-light">';
				htmlCode += '<h3>' + data.biography.intro.title + '</h3>';
				htmlCode += '<h4>' + data.biography.intro.subtitle + '</h4>';
				htmlCode += '<p>' + data.biography.intro.text + '</p></div></div>';
			}
			if (data.biography.education) {
				htmlCode += '<div class="bio-row row"><div class="col-xs-12 col-sm-12 col-md-3"></div>';
				htmlCode += '<div class="col-xs-12 col-sm-12 col-md-9 dotted-spaced-light">';
				htmlCode += '<h3>' + data.biography.education.title + '</h3>';
				htmlCode += '<h4>' + data.biography.education.subtitle + '</h4>';
				htmlCode += getBioRecords(data.biography.education.record);
				htmlCode += '</div></div>';
            }
            if (data.biography.awards) {
				htmlCode += '<div class="bio-row row"><div class="col-xs-12 col-sm-12 col-md-3"></div>';
				htmlCode += '<div class="col-xs-12 col-sm-12 col-md-9 dotted-spaced-light">';
				htmlCode += '<h3>' + data.biography.awards.title + '</h3>';
				htmlCode += '<h4>' + data.biography.awards.subtitle + '</h4>';
				htmlCode += getBioRecords(data.biography.awards.record);
				htmlCode += '</div></div>';
            }
            if (data.biography.exhibitions) {
				htmlCode += '<div class="bio-row row"><div class="col-xs-12 col-sm-12 col-md-3"></div>';
				htmlCode += '<div class="col-xs-12 col-sm-12 col-md-9 dotted-spaced-light">';
				htmlCode += '<h3>' + data.biography.exhibitions.title + '</h3>';
				htmlCode += '<h4>' + data.biography.exhibitions.subtitle + '</h4>';
				htmlCode += getBioRecords(data.biography.exhibitions.record);
				htmlCode += '</div></div>';
			}
		}

		return htmlCode;
	}

	//helper function
	function getBioRecords(records) {
		var htmlCode = '';

		$(records).each(function(key, val) {
			link = '';
			val.recordlink = val.recordlink.trim();
			if (val.recordlink !== '') {
				link =
					'<a href="' + val.recordlink + '" target="_blank"><i class="bio-link icon ion-ios-paper"></i></a>';
			}
			htmlCode += '<tr><td class="table-bio-date">' + val.recordpoint + '</td>';
			htmlCode += '<td>' + val.recordtext + link;
			htmlCode += '</td></tr>';
		});
		htmlCode = '<table>' + htmlCode + '</table>';

		return htmlCode;
	}

	function getPublicationsSnippet(data) {
		var htmlCode = '';
		if (data.publications) {
			if (data.publications.record) {
				$(data.publications.record).each(function(key, val) {
					htmlCode += '<div class="row dotted-spaced-light pub-item"><div class="col-12 col-sm-5">';
					htmlCode += '<div id="publication-carousel_' + key + '" class="carousel carousel-pub slide data-ride="carousel">';
					htmlCode += '<div class="carousel-inner">';
					if (val.carousel.images) { 
						$(val.carousel.images).each(function(key, val) {
							let classActive = '';
							key === 0 ? classActive = 'active' : classActive = '';
							htmlCode += '<div class="carousel-item ' + classActive + '">';
							htmlCode += '<img class="d-block w-100" src="' + val.path + '" alt="' + val.alt + '">';
							htmlCode += '</div>';
						});
					}
					htmlCode += '</div>';
					htmlCode += '<a class="carousel-control-prev" href="#publication-carousel_' + key + '" role="button" data-slide="prev">';
					htmlCode += '<span aria-hidden="true"><i class="icon ion-ios-arrow-back"></i></span><span class="sr-only">Previous</span></a>';
					htmlCode += '<a class="carousel-control-next" href="#publication-carousel_' + key + '" role="button" data-slide="next">';
					htmlCode += '<span aria-hidden="true"><i class="icon ion-ios-arrow-forward"></i></span><span class="sr-only">Next</span></a>';
					htmlCode += '</div></div>';
					htmlCode += '<div class="col-12 col-sm-7">';
					htmlCode += '<h3>' + val.title.toLowerCase() + '</h3>';
					htmlCode += '<h4>' + val.subtitle.toLowerCase() + '</h4>';
					htmlCode += '<p>' + val.text + '</p>';
					if (val.btn && val.btn.link !== '' ) {
						htmlCode += '<a href="' + val.btn.link + '" target="_blank" class="btn-site" role="button">'
						htmlCode += '<span>' + val.btn.text.toUpperCase() + '</span></a>';
					}
					htmlCode += '</div></div>';
				});
			}
		}

		return htmlCode;
	}

	return {
		getSiteData: getSiteData
	};
})();
