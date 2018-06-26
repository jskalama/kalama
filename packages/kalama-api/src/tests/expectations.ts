import { expect } from 'chai';

export const expectToBeAValidResource = (obj: any) => {
    expect(obj).to.haveOwnProperty('url');
    expect(obj.url).to.be.a('string');
};

export const expectToBeAValidItem = (obj: any) => {
    expectToBeAValidResource(obj);
    expect(obj).to.haveOwnProperty('label');
    expect(obj.label).to.be.a('string');
};

export const expectToBeAValidPlayableTrack = (obj: any) => {
    expectToBeAValidResource(obj);
    expect(obj).to.haveOwnProperty('title');
    expect(obj.title).to.be.a('string');
    expect(obj).to.haveOwnProperty('url');
    expect(obj.url).to.be.a('string');
    expect(obj).to.haveOwnProperty('id');
    expect(obj.id).to.be.a('string');
};

export const expectToHaveUniqueIds = (items: Array<any>) => {
    const uniqueIds = new Set();
    items.forEach(({ id }) => {
        expect(uniqueIds.has(id)).to.equal(false);
        uniqueIds.add(id);
    });
};
