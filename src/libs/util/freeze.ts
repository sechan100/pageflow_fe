

function deepFreeze(object: any) {
  // 먼저 객체 자신을 동결
  Object.freeze(object);
  
  // 객체의 모든 프로퍼티를 순회
  Object.keys(object).forEach((key) => {
    const property = object[key];
    
    // 프로퍼티가 객체이며 아직 동결되지 않았다면
    if (typeof property === 'object' && property !== null && !Object.isFrozen(property)) {
      // 해당 프로퍼티를 재귀적으로 동결
      deepFreeze(property);
    }
  });

  return object;
}

export default deepFreeze;