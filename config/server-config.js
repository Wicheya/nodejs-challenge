import Vision from "@hapi/vision";
import handlebars from "handlebars";

export function getServerConfig(config){
    return config || {
        port: 3000,
        host: '0.0.0.0',
        routes: {
        validate: {
            // REF : https://medium.com/@piotrkarpaa/handling-joi-validation-errors-in-hapi-17-26fc07448576
        failAction: async (request, h, err) => {
            if (process.env.NODE_ENV === 'production') {
                // In prod, log a limited error message and throw the default Bad Request error.
                throw Boom.badRequest(`Invalid request payload input`);
            } else {
                // During development, log and respond with the full error.
                throw err;
                }
            }
        }
        }
    }
}

export async function registerView(server){
    await server.register(Vision);

    handlebars.registerHelper("iso_to_date_string" , function(str){
        return new Date(str).toLocaleString()
    })
    server.views({
        engines: {
            html: handlebars,
        },
        path: 'templates'
    });
}