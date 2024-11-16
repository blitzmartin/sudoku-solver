const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
     test('Solve a puzzle with valid puzzle string: POST /api/solve', (done) => {
          const puzzle = puzzlesAndSolutions[0][0];
          const solution = puzzlesAndSolutions[0][1];

          chai
               .request(server)
               .post('/api/solve')
               .send({ puzzle })
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'solution');
                    assert.equal(res.body.solution, solution);
                    done();
               });
     });

     test('Solve a puzzle with missing puzzle string: POST /api/solve', (done) => {
          chai
               .request(server)
               .post('/api/solve')
               .send({})
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Required field missing' });
                    done();
               });
     });

     test('Solve a puzzle with invalid characters: POST /api/solve', (done) => {
          const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.36abc.3.7.2..9.47...8..1..16....926914.37.';

          chai
               .request(server)
               .post('/api/solve')
               .send({ puzzle })
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
                    done();
               });
     });

     test('Check a placement with all fields: POST /api/check', (done) => {
          const puzzle = puzzlesAndSolutions[0][0];
          const coordinate = 'A1';
          const value = '7';

          chai
               .request(server)
               .post('/api/check')
               .send({ puzzle, coordinate, value })
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid');
                    assert.isTrue(res.body.valid);
                    done();
               });
     });

     test('Check a placement with single conflict: POST /api/check', (done) => {
          const puzzle = puzzlesAndSolutions[0][0];
          const coordinate = 'A1';
          const value = '1';

          chai
               .request(server)
               .post('/api/check')
               .send({ puzzle, coordinate, value })
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isFalse(res.body.valid);
                    assert.deepEqual(res.body.conflict, ['row']);
                    done();
               });
     });

     test('Check a placement with multiple conflicts: POST /api/check', (done) => {
          const puzzle = puzzlesAndSolutions[0][0];
          const coordinate = 'A1';
          const value = '9';

          chai
               .request(server)
               .post('/api/check')
               .send({ puzzle, coordinate, value })
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isFalse(res.body.valid);
                    assert.deepEqual(res.body.conflict, ['row', 'column', 'region']);
                    done();
               });
     });

     test('Check a placement with missing required fields: POST /api/check', (done) => {
          const puzzle = puzzlesAndSolutions[0][0];

          chai
               .request(server)
               .post('/api/check')
               .send({ puzzle })
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Required field(s) missing' });
                    done();
               });
     });

     test('Check a placement with invalid coordinate: POST /api/check', (done) => {
          const puzzle = puzzlesAndSolutions[0][0];
          const coordinate = 'Z9';
          const value = '9';

          chai
               .request(server)
               .post('/api/check')
               .send({ puzzle, coordinate, value })
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Invalid coordinate' });
                    done();
               });
     });

     test('Check a placement with invalid value: POST /api/check', (done) => {
          const puzzle = puzzlesAndSolutions[0][0];
          const coordinate = 'A1';
          const value = 'X';

          chai
               .request(server)
               .post('/api/check')
               .send({ puzzle, coordinate, value })
               .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Invalid value' });
                    done();
               });
     });
     /*   test('Value already placed in puzzle', function () {
            const puzzle =
                 '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            const coordinate = 'A1'; // First row, first column
            const value = '1'; // Value already in place
  
            chai
                 .request(server)
                 .post('/api/check')
                 .send({ puzzle, coordinate, value })
                 .end((err, res) => {
                      assert.equal(res.status, 200);
                      assert.isObject(res.body);
                      assert.property(res.body, 'valid');
                      assert.isTrue(res.body.valid);
                 });
       }); */
});
