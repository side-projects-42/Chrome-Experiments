var lb = require("../lb.js")

require("tap").test("lower bound", function(t) {

  t.equals(lb([0,1,1,1,2], -1), -1)
  t.equals(lb([0,1,1,1,2], 0), 0)
  t.equals(lb([0,1,1,1,2], 1), 1)
  t.equals(lb([0,1,1,1,2], 2), 4)
  t.equals(lb([0,1,1,1,2], 0.5), 0)
  t.equals(lb([0,1,1,1,2], 1.5), 3)
  t.equals(lb([0,1,1,1,2], 5), 4)

  t.equals(lb([0,2,5,6], 0), 0)
  t.equals(lb([0,2,5,6], 1), 0)
  t.equals(lb([0,2,5,6], 2), 1)
  t.equals(lb([0,2,5,6], 3), 1)
  t.equals(lb([0,2,5,6], 4), 1)
  t.equals(lb([0,2,5,6], 5), 2)
  t.equals(lb([0,2,5,6], 6), 3)

  function cmp(a,b) {
    return a - b
  }
  
  t.equals(lb([0,1,1,1,2], -1, cmp), -1)
  t.equals(lb([0,1,1,1,2], 0, cmp), 0)
  t.equals(lb([0,1,1,1,2], 1, cmp), 1)
  t.equals(lb([0,1,1,1,2], 2, cmp), 4)
  t.equals(lb([0,1,1,1,2], 0.5, cmp), 0)
  t.equals(lb([0,1,1,1,2], 1.5, cmp), 3)
  t.equals(lb([0,1,1,1,2], 5, cmp), 4)

  t.equals(lb([0,2,5,6], 0, cmp), 0)
  t.equals(lb([0,2,5,6], 1, cmp), 0)
  t.equals(lb([0,2,5,6], 2, cmp), 1)
  t.equals(lb([0,2,5,6], 3, cmp), 1)
  t.equals(lb([0,2,5,6], 4, cmp), 1)
  t.equals(lb([0,2,5,6], 5, cmp), 2)
  t.equals(lb([0,2,5,6], 6, cmp), 3)

  t.end()
})