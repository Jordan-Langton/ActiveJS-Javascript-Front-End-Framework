import { BIND } from '../ActiveJs_Packages/BIND.js';

test('@for directive single element', () => {

    document.body.innerHTML = `
    <table>
      <tr>
        <th>Name</th>
        <th>Age</th>
      </tr>
      <tr vm-gtSXBIq="user in user">
        <td>[user.name]</td>
        <td>[user.age]</td>
      </tr>
    </table>
    `;

    BIND.For({
        users: [
            {name: 'User 1', age: 11},
            {name: 'User 2', age: 21},
            {name: 'User 3', age: 31}
        ]
    }, false, () => {
        console.log(document.body.innerHTML)
        expect(document.body.innerHTML).toEqual(`
            <table>
              <tr>
                <th>Name</th>
                <th>Age</th>
              </tr>
              <tr vm-gtSXBIq="user in users">
                <td>User 1</td>
                <td>11</td>
              </tr>
              <tr vm-gtSXBIq="user in users">
                <td>User 2</td>
                <td>21</td>
              </tr>
              <tr vm-gtSXBIq="user in users">
                <td>User 3</td>
                <td>31</td>
              </tr>
            </table>
        `);
    });

});