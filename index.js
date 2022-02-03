const express = require("express");
const ldap = require("ldapjs");

const app = express();

const client = ldap.createClient({
  url: "ldap://127.0.0.1:10389",
});

const searchUser = () => {
  const opts = {
    filter: "(uid=*)",
    scope: "sub",
    attributes: ["sn", "cn", "uid"],
  };

  client.search("ou=users,ou=system", opts, (err, res) => {
    // assert.ifError(err);

    res.on("searchRequest", (searchRequest) => {
      console.log("searchRequest: ", searchRequest.messageID);
    });
    res.on("searchEntry", (entry) => {
      console.log("entry: " + JSON.stringify(entry.object));
    });
    res.on("searchReference", (referral) => {
      console.log("referral: " + referral.uris.join());
    });
    res.on("error", (err) => {
      console.error("error: " + err.message);
    });
    res.on("end", (result) => {
      console.log("status: " + result.status);
    });
  });
};

const addUser = () => {
  const entry = {
    sn: "bar",
    // email: "demo@gmail.com",
    userPassword: "Demo@123",
    objectclass: "inetOrgPerson",
  };
  client.add("cn=foo;ou=users,ou=system", entry, (err) => {
    if (err) {
      console.log("Something went wrong in the add user", err);
    } else {
      console.log("User Added successfully...");
    }
  });
};

const deleteUser = () => {
  client.del("cn=foo;ou=users,ou=system", (err) => {
    if (err) {
      console.log("Someting went wrong in deleting user", err);
    } else {
      console.log("User delete Successfully");
    }
  });
};

const addUserToGroup = (groupName) => {
  const change = new ldap.Change({
    operation: "add",
    modification: {
      uniqueMember: "cn=Demo;ou=users,ou=system",
    },
  });

  client.modify(groupName, change, (err) => {
    if (err) {
      console.log("Something went wrong while adding user to group", err);
    } else {
      console.log("User added to the group successfully");
    }
  });
};

const findUsersFromGroup = () => {
  const opts = {
    filter: "(objectClass=*)",
    scope: "sub",
  };

  client.search("ou=groups,ou=system", opts, (err, res) => {
    // assert.ifError(err);

    res.on("searchRequest", (searchRequest) => {
      console.log("searchRequest: ", searchRequest.messageID);
    });
    res.on("searchEntry", (entry) => {
      console.log("entry: " + JSON.stringify(entry.object));
    });
    res.on("searchReference", (referral) => {
      console.log("referral: " + referral.uris.join());
    });
    res.on("error", (err) => {
      console.error("error: " + err.message);
    });
    res.on("end", (result) => {
      console.log("status: " + result.status);
    });
  });
};

const deleteUserFromGroup = (groupName) => {
  const change = new ldap.Change({
    operation: "delete",
    modification: {
      uniqueMember: "cn=Demo;ou=users,ou=system",
    },
  });

  client.modify(groupName, change, (err) => {
    if (err) {
      console.log("Something went wrong while deleting user from group", err);
    } else {
      console.log("User deleted from the group successfully");
    }
  });
};

const updateUser = () => {
  const change = new ldap.Change({
    operation: "replace",
    modification: {
      displayName: "abcd@gmail.com",
    },
  });

  client.modify("cn=Demo;ou=users,ou=system", change, (err) => {
    if (err) {
      console.log("Something went wrong while updating user", err);
    } else {
      console.log("User updated successfully");
    }
  });
};

const compare = () => {
  client.compare("cn=foo;ou=users,ou=system", "userPassword", "Demo@123", (err, matched) => {
    if (err) {
      console.log("Something went wrong while comparing user", err);
    } else {
      console.log("matched: " + matched);
    }
  });
};

const modifyDN = () => {
    client.modifyDN('cn=foo;ou=users,ou=system', 'cn=bar', (err) => {
        if (err) {
            console.log("Something went wrong while modfying the DN", err);
        } else{
            console.log("DN modified successfully");
        }
      });
}


const authenticateDN = (username, password) => {
  client.bind(username, password, (err) => {
    if (err) {
      console.log("Error in new console", err);
    } else {
      console.log("Connected to AD");
      // searchUser();
      // addUser();
      // deleteUser();
      // addUserToGroup("cn=Administrators,ou=groups,ou=system")
      // findUsersFromGroup()
      // deleteUserFromGroup("cn=Administrators,ou=groups,ou=system");
      // updateUser();
      // compare();
    //   modifyDN();
    }
  });
};

app.listen(9876, () => {
  console.log("Server has been started on port 9876");
  authenticateDN("cn=bar;ou=users,ou=system", "Demo@123");
});
