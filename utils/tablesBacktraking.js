/**
 * Backtracking algorithm to find the best combination of tables 
 * 
 * The algorithm looks for the combination of tables that wastes less capacity and uses fewer tables
 */

let bestConf
let bestConfNumPeople
let bestConfNumTables

function isSolution(conf, numPeople) {
     const sum = conf.reduce((p, c) => p + c.capacity, 0)
     return sum >= numPeople
}

function evaluateSolution(conf) {
     const sum = conf.reduce((p, c) => p + c.capacity, 0)
     if ((sum < bestConfNumPeople) ||
          (sum == bestConfNumPeople && conf.length < bestConfNumTables)) {
          bestConf = [...conf]
          bestConfNumPeople = sum
          bestConfNumTables = conf.length
     }
}

function popByValue(availableTables, table) {
     let index
     for (let i = 0; i < availableTables.length; i++) {
          if (availableTables[i].id == table.id) {
               index = i
               break
          }
     }
     const availableTablesCopy = [...availableTables]
     availableTablesCopy.splice(index, 1)
     return availableTablesCopy
}

function tablesBacktraking(conf, availableTables, numPeople) {
     availableTables.forEach(table => {
          conf.push(table)

          if (isSolution(conf, numPeople))
               evaluateSolution(conf);
          else
               tablesBacktraking(conf, popByValue(availableTables, table), numPeople);

          conf.pop()
     });
}

function tablesAlgorithm(totalPeople, availableTables) {
     bestConf = []
     bestConfNumPeople = Number.MAX_SAFE_INTEGER
     bestConfNumTables = Number.MAX_SAFE_INTEGER

     tablesBacktraking([], availableTables, totalPeople)

     return bestConf
}

module.exports = tablesAlgorithm