import * as express from 'express';
import { Request, Response } from 'express';
import * as path from 'path';
import * as async from 'async';
import * as newman from 'newman';
import * as multer from 'multer';
import axios from 'axios';

const upload = multer({ dest: '/tmp/' });


export class Routes {

  routes(app: express.Application): void {

    app.route('/loadTest').post(upload.single('file'), (req: Request, res: Response) => {

        const options = {
            collection: path.join(req.file.path),
          },

          parallelCollectionRun = (done) => {
            newman.run(options, done);
          };

        // Run the Postman sample collection thrice, in parallel.
        async.parallel([
            parallelCollectionRun,
            parallelCollectionRun,
            parallelCollectionRun
          ],

          async (err, results) => {
            const summary = results.map((data, index) => ({ iteration: index, result: this.createSummary(data) }))
              .reduce((acc, data, index) => ({ ...acc, index: { ...data } }), {});
            await axios.post('http://localhost:9200/myindex/1', summary);
            res.status(200).send(summary);
         });
      });
  }

  createSummary(summary) {

    // Just pull out the miminum parts for each failure
    const failures = [];
      summary.run.failures.forEach((failure) => {
        failures.push({
          'Parent': {
            'Name': failure.parent.name,
            'Id' : failure.parent.id
          },
          'Source': {
            'Name': failure.source.name,
            'Id' : failure.source.id
          },
          'Error': {
            'Message': failure.error.message,
            'Test' : failure.error.test
          }
        });
      });

    // Build main object with just the bits needed plus the slimmed down failures
    const result = {};
    Object.assign(result, {
      'Collection': {
        'Info': {
          'Name': summary.collection.name,
          'Id': summary.collection.id
        }
      },
      'Run': {
        'Stats': {
          'Requests' : summary.run.stats.requests,
          'Assertions' : summary.run.stats.assertions
        },
        'Failures': failures,
        'Timings' : summary.run.timings
      }
    });
    return result;
  }

}
