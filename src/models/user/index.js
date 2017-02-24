async function save({ User }, user) {
  let userDoc = new User(user);
  await userDoc.save();
  userDoc = userDoc.toObject();
  delete userDoc.password;
  return userDoc;
}

async function findOne({ User }, idEmailUsername) {
  const user = await User.findOne(
    { $or: [{ _id: idEmailUsername }, { email: idEmailUsername }, { username: idEmailUsername }] },
    { password: 0 }
  );
  return user.toObject();
}

async function remove({ User }, id) {
  await User.remove({ _id: id });
}

async function update({ User }, id, updates) {
  const user = await User.findByIdAndUpdate(id, { $set: updates }, { new: true });
  return user.toObject();
}


export default function (deps) {
  return {
    save: save.bind(null, deps),
    findOne: findOne.bind(null, deps),
    remove: remove.bind(null, deps),
    update: update.bind(null, deps),
  };
}
