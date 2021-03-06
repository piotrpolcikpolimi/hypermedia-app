const global = {

    getTemplateSlot: (elementName) => {
        return $(`#${elementName}-slot`);
    },

    formatElementName: (elementName) => {
        return elementName.charAt(0).toUpperCase() + elementName.slice(1);
    },

    getTemplate: async (elementName) => {
        elementName = global.formatElementName(elementName);
        const template = await fetch(`/assets/components/${elementName}/${elementName.toLowerCase()}.html`);
        return template.text();
    },

    insertCSSToHead: (elementName) => {
        elementName = global.formatElementName(elementName);
        let found = false;
        const href = `/assets/components/${elementName}/${elementName.toLowerCase()}.css`;
        $("head link[rel='stylesheet']").last().after(`<link rel='stylesheet' href='${href}' type='text/css' media='screen'>`);
    },

    appendChildrenToSlot: (slot, elements) => {
        elements.forEach(element => {
            slot.append(`${element.render()}`);
        })
    },

    initMap: (coordinates, center, zoom = 14) => {
        const mapSlot = $('#map');
        if (!center) center = coordinates[0];
        const map = new google.maps.Map(
            mapSlot[0],
            {zoom: zoom, center: center, gestureHandling: 'none'}
        );

        coordinates.map(location => {
            new google.maps.Marker({position: location, map: map})
        })
        if (coordinates.length === 1){
            mapSlot.click(() => {
                window.open(`https://maps.google.com/?q=${coordinates[0].lat},${coordinates[0].lng}`, '_blank')
            })
        }
        global.addAltsToGoogleMapsImages(map);
    },

    addAltsToGoogleMapsImages: (map)  => {
        google.maps.event.addListener(map, 'tilesloaded', function() {
            const images = $('#map img');
           
            images.each((i, img) => {
                img.alt = "Google maps image element";
            });

            const mapAreas = $('map area');
            mapAreas.each((i, area) => {
                area.alt = "Google maps map area";
            });
        })
    },

    fetchData: (endpoint, queryString = '') => {
        return fetch(`/v1${endpoint}?${queryString}`);
    },

    postData: (endpoint, data, type) => {
        return fetch(`/v1/${endpoint}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': type
            },
            body: data
        })
    },

    appendTestimonials: (testimonials) => {
        if (testimonials.length > 0) {
            global.appendChildrenToSlot(global.getTemplateSlot('testimonial'), testimonials)
        } else {
            $('#testimonials').css('display', 'none');
        }
    },

    scrollTo: (elementId) => {
        const yOffset = -104; 
        const element = document.getElementById(elementId);
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({top: y, behavior: 'smooth'});
    },

    format_date_dd_Month_yyyy: (date) => {
        const dateObj = new Date(date);
        return `${dateObj.getDate()} ${dateObj.toLocaleString('en-US', { month: 'long' })} ${dateObj.getFullYear()}`;
    },

    format_date_yyyy: (date) => {
        return new Date(date).getFullYear();
    },

    format_date_hh: (time) => {
        let [hh, mm, ss] = time.split(':');

        const dateObj = new Date();
        dateObj.setTime(hh * 3600000 + mm * 60000 + ss * 1000);

        return dateObj.toLocaleString('en-us', {hour: 'numeric', minute: 'numeric', hour12: true});
    },

    insertDataIntoDOM: (data) => {
        $('[data-type="string"]').each((i, el) => {
            $(el).html(
                _.get(data, $(el).attr('data-value'))
            );
        });

        $('[data-type="concat-string"]').each((i, el) => {
            values = Array.from($(el).attr('data-value').split("|"));
            $(el).html(values.map(val => _.get(data, val))
                            .join($(el).attr('data-separator')));
        });


        $('[data-type="image"]').each((i, el) => {
            $(el).attr('src', 
                _.get(data, $(el).attr('data-value'))
            );
        });

        $('[data-type="date"]').each((i, el) => {
            $(el).html(
                global[`format_date_${$(el).attr('data-format')}`](
                    _.get(data, $(el).attr('data-value'))
                )
            );
        });

        $('[data-type="currency"]').each((i, el) => {
            $(el).html(
                _.get(data, $(el).attr('data-value')).toFixed(2)
            );
        })

        $('[data-type="number"]').each((i, el) => {
            let value = _.get(data, $(el).attr('data-value'));
            if (value > 9999) {
                value = value.toString().slice(0, -3) + 'k';
            }
            $(el).html(value + '+');
        });
    },

    submitForm: async (e , form_id, fields,  endpoint, msg="Thank you for your message!") => {
        e.preventDefault();
        const data = new URLSearchParams();

        fields.forEach(el => {
            const key = Object.keys(el)[0];
            data.append(key, _.get(document, `${el[key]}.value`));
        });

        global.postData(endpoint, data, 'application/x-www-form-urlencoded')
        .then(resp => {
            global.updateForm(resp, msg, form_id);
        });
        const width = $(`#${form_id}`).width();
        const height = $(`#${form_id}`).height();
        $(`#${form_id}`).css({'height':height, 'width':width});

    },

    updateForm: (resp, msg, form_id) => {
        if (resp.status === 200) {
            $(`#${form_id}`).html(
                `<span style="position:relative;top:30%; margin: 0 auto;">${msg}</span>`
            );
        } else {
            $(`#${form_id}`).html(
                '<span>Something went wrong. Please, try again later.</span>'
            )
        }
    },

    loaded: () => {
        $('#loader div').css('display', 'none');
        $('#loader').animate({
            opacity: 0
        }, 1000, function() {
            $('#loader').css('display', 'none');
        })
    },
}