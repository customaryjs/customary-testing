Testing the asynchronous aspects of web pages can be tricky. When a page first loads, or when your test interacts with it, it's unpredictable when updates will finally "settle" so you can do test assertions on page content. But if you're using Mocha, you can leverage `retries` to cleanly repeat your assertions until content eventually matches or the test fails.
# Plain static page

Wrap content assertions in an `it` section with `retries`.

```typescript
describe(suite.title, async function (){
    this.timeout(4000);
    this.slow(500);

    describe('happy day', async function () {
	    let window: Window;

	    before(() => window = CT.open(suite.subject_html));
	    after(() => window.close());

        it('looks good', async function () {
            this.retries(64);
            CT.spot('Hello Customary !', window, {selectors: 'h1'});
        });
    });
});
```

* For each test case that needs the page brand new:
	* Add its own `describe`.
		* Add a `before` to open the page.
		* Add an `after` to close the page.
		* Add one `it` to assert page content.
			* Add enough `retries` to accommodate slow page load.

# With interactions

Write multiple `it` sections in succession, alternating between content assertion and page interaction.

* In content assertion sections, use `retries` to accommodate asynchronous updates. 
* In page interaction sections, use plain code to fail tests immediately.

```typescript
describe(suite.title, async function (){
    this.timeout(4000);
    this.slow(500);

    describe('happy day', async function () {
	    let window: Window;

	    before(() => window = CT.open(suite.subject_html));
	    after(() => window.close());

        let element: HTMLElement;
        
        it('looks good', async function () {
            this.retries(64);
            element = CT.querySelector('hello-world', window);
            CT.spot('Hello Customary !', element, {selectors: 'span'});
        });
        it('interact', async function () {
            (CT.querySelector('button', element) as HTMLButtonElement).click();
        });
        it('looks good', async function () {
            this.retries(16);
            element = CT.querySelector('hello-world', window);
            chai.assert.isAbove(
                Number.parseFloat(element.style.fontSize.replace('px', '')),
                40
            );
        });
    });
});
```

* For each test case `describe`:
	* Add a first `it` to assert initial page content.
	* Add a second `it` to interact.
		* Do not add `retries`; any interaction error should fail the test.
	* Add a third `it` to assert effects of the interaction.
		* Add enough `retries` to accommodate slow interaction effects.
	* Add as many `it` sections as needed for interaction and assertion.
